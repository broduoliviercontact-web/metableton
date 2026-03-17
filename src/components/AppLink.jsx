function isModifiedEvent(event) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

function AppLink({
  href,
  className,
  currentPath,
  children,
  isActive: isActiveOverride,
  onNavigate,
  ...props
}) {
  const isActive =
    typeof isActiveOverride === "boolean"
      ? isActiveOverride
      : href !== "#" && currentPath === href;

  const handleClick = (event) => {
    if (!onNavigate || href === "#" || isModifiedEvent(event) || event.button !== 0) {
      return;
    }

    const target = props.target;

    if (target && target !== "_self") {
      return;
    }

    event.preventDefault();
    onNavigate(href);
  };

  const classes = [className, isActive ? "is-active" : ""].filter(Boolean).join(" ");

  return (
    <a {...props} className={classes} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}

export default AppLink;
