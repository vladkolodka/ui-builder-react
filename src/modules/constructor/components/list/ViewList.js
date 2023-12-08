export default function ViewList(params) {
  const {
    // value,
    children
  } = params;

  return <>
    <p>ViewList</p>
    <ul>
      {children}
    </ul>
  </>;
}
