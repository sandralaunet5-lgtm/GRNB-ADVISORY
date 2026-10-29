// Collez ici les 2 valeurs de Supabase (Project Settings > API)
// ⚠️ N'utilisez JAMAIS la clé "service_role" ici : uniquement la clé "anon" / "publishable".
window.SUPABASE_URL = 'https://swuphbzyglzvvncbkpae.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dXBoYnp5Z2x6dnZuY2JrcGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNDI4MjUsImV4cCI6MjEwNzgxODgyNX0.OyMnSuDTMBQ2cHP6uvjywBYEpDt1ukrRGcB3uTtMM5c';
// 2. LA LIGNE CRUCIALE A VÉRIFIER :
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
