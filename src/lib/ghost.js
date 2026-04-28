const GHOST_CONTENT_API_URL = import.meta.env.VITE_GHOST_CONTENT_API_URL;
const GHOST_CONTENT_API_KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY;

function isConfigured() {
  return Boolean(GHOST_CONTENT_API_URL && GHOST_CONTENT_API_KEY);
}

function stripHtml(html) {
  if (!html) {
    return "";
  }

  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent?.replace(/\s+/g, " ").trim() || "";
}

function mapGhostPost(post) {
  const summary = post.custom_excerpt || post.excerpt || stripHtml(post.html).slice(0, 220);

  return {
    id: `ghost-${post.id}`,
    ghostId: post.id,
    slug: post.slug,
    path: `/blog-news/${post.slug}`,
    section: "blog-news",
    type: "Article",
    label: "Ghost",
    title: post.title,
    summary,
    excerpt: summary,
    heroImage: post.feature_image || "",
    heroImagePosition: "50% 50%",
    thumbnail: post.feature_image || "",
    thumbnailPosition: "50% 50%",
    imageAlt: post.feature_image_alt || post.title,
    tags: (post.tags || []).map((tag) => tag.name).filter(Boolean),
    featured: false,
    publishedAt: post.published_at || post.updated_at || post.created_at,
    html: post.html || "",
    source: "ghost",
  };
}

export function isGhostConfigured() {
  return isConfigured();
}

export async function getGhostPosts() {
  if (!isConfigured()) {
    return [];
  }

  const params = new URLSearchParams({
    key: GHOST_CONTENT_API_KEY,
    include: "tags",
    formats: "html",
    limit: "20",
    order: "published_at DESC",
  });

  const response = await fetch(`${GHOST_CONTENT_API_URL.replace(/\/$/, "")}/posts/?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Ghost request failed: ${response.status}`);
  }

  const payload = await response.json();
  return (payload.posts || [])
    .filter((post) => post.slug !== "coming-soon")
    .map(mapGhostPost);
}
