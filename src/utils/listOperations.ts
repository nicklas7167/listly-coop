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
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("share_code", shareCode)
    .single();

  if (error) throw new Error("List not found");
  return data;
}

export async function joinList(shareCode: string) {
  console.log("Joining list with share code:", shareCode);
  const user = await getCurrentUser();
  
  // First, get the list ID from the share code
  const { data: list } = await supabase
    .from("lists")
    .select("id")
    .eq("share_code", shareCode)
    .single();

  if (!list) throw new Error("List not found");

  try {
    const { error } = await supabase
      .from("list_members")
      .insert({
        list_id: list.id,
        user_id: user.id
      });

    if (error) {
      if (error.code === "23505") {
        // Unique violation - already a member
        return { alreadyMember: true };
      }
      throw error;
    }

    return { alreadyMember: false };
  } catch (error) {
    console.error("Error joining list:", error);
    throw error;
  }
}