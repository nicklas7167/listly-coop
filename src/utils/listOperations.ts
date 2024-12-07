import { supabase } from "@/integrations/supabase/client";

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("User not authenticated");
  }
  return user;
}

export async function createList(listName: string) {
  const user = await getCurrentUser();
  
  const { data, error } = await supabase
    .from("lists")
    .insert({
      name: listName,
      owner_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkListExists(shareCode: string) {
  console.log("Checking list with share code:", shareCode);
  
  // Make sure we're querying with the exact share code
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("share_code", shareCode.trim())
    .maybeSingle();  // Use maybeSingle instead of single to handle no results gracefully

  if (error) {
    console.error("Error checking list existence:", error);
    throw new Error("Error checking list");
  }
  
  if (!data) {
    console.error("No list found with share code:", shareCode);
    throw new Error("List not found");
  }

  console.log("Found list data:", data);
  return data;
}

export async function joinList(shareCode: string) {
  console.log("Starting join list process with share code:", shareCode);
  const user = await getCurrentUser();
  console.log("Current user:", user.id);
  
  // First, get the list ID from the share code
  const list = await checkListExists(shareCode);
  console.log("Found list with ID:", list.id);

  try {
    // Check if already a member
    const { data: existingMembership, error: membershipError } = await supabase
      .from("list_members")
      .select("*")
      .eq("list_id", list.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError) {
      console.error("Error checking membership:", membershipError);
      throw membershipError;
    }

    if (existingMembership) {
      console.log("User is already a member");
      return { alreadyMember: true };
    }

    // Insert new membership
    const { error: insertError } = await supabase
      .from("list_members")
      .insert({
        list_id: list.id,
        user_id: user.id
      });

    if (insertError) {
      console.error("Error inserting membership:", insertError);
      throw insertError;
    }

    console.log("Successfully joined list");
    return { alreadyMember: false };
  } catch (error) {
    console.error("Error in join list process:", error);
    throw error;
  }
}