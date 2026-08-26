const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const env = fs.readFileSync(".env.local", "utf8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const url = urlMatch ? urlMatch[1].trim() : "";
const key = keyMatch ? keyMatch[1].trim() : "";
const supabase = createClient(url, key);

async function test() {
  const res = await supabase
    .from("resources")
    .select(
      "id, title, slug, description, category_id, tech_id, technology, tags, source_code, preview_html, preview_image_url, responsive_desktop, responsive_tablet, responsive_mobile, status, created_at, updated_at, categories(name)"
    )
    .eq("slug", "glass-button")
    .eq("status", "published")
    .maybeSingle();

  console.log("Result:", JSON.stringify(res, null, 2));
}

test();
