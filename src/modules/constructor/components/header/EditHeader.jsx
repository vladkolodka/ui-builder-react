export default function EditHeader(params) {
  const {
    level: {value: level, setValue: setLevel},
    value, setValue
  } = params;

  return <>
    EditHeader component level {level}:
    <button onClick={() => setLevel(3)}>Set header level</button>
    <input type="text" value={value || ''} onChange={e => setValue(e.target.value)} />
  </>;
}
