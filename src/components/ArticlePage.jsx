function ArticleBlock({ block }) {
  if (block.type === "heading") {
    return <h2 className="article-block__heading">{block.content}</h2>;
  }

  if (block.type === "paragraph") {
    return <p className="article-block__paragraph">{block.content}</p>;
  }

  if (block.type === "list") {
    return (
      <ul className="article-block__list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="article-block__quote">
        <p>{block.content}</p>
      </blockquote>
    );
  }

  if (block.type === "callout") {
    return (
      <aside className="article-block__callout" aria-label={block.label || "Note"}>
        {block.label ? <p className="article-block__callout-label">{block.label}</p> : null}
        <p className="article-block__callout-text">{block.content}</p>
      </aside>
    );
  }

  if (block.type === "image" || block.type === "gif") {
    return (
      <figure className={`article-block__media article-block__media--${block.type}`}>
        <img
          className="article-block__image"
          src={block.src}
          alt={block.alt}
          loading="lazy"
        />
        {block.caption ? <figcaption className="article-block__caption">{block.caption}</figcaption> : null}
      </figure>
    );
  }

  return null;
}

function ArticlePage({ article, sectionTitle }) {
  return (
    <article className="article-page" aria-labelledby="article-title">
      <div className="article-page__media">
        <img
          className="article-page__image"
          src={article.heroImage}
          alt={article.imageAlt}
        />
      </div>

      <header className="article-page__header">
        <p className="article-page__category">{sectionTitle}</p>
        <h1 className="article-page__title" id="article-title">
          {article.title}
        </h1>
        <p className="article-page__summary">{article.summary}</p>
      </header>

      <div className="article-page__body">
        {article.content.map((block, index) => (
          <ArticleBlock block={block} key={`${block.type}-${index}`} />
        ))}
      </div>
    </article>
  );
}

export default ArticlePage;
