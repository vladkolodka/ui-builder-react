export default function ViewHeader(params){
  const {
    level: {value: level, setValue: setLevel},
    value
  } = params;

  const HeaderTag = `h${level}`;

  return <>
    <HeaderTag>ViewHeader component: {value}</HeaderTag>
    <button onClick={() => setLevel(1)}>1</button>
    <button onClick={() => setLevel(2)}>2</button>
    <button onClick={() => setLevel(3)}>3</button>
  </>;
}
