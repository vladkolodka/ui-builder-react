export default function EditText({value, setValue}){
  return <input type="text" value={value || ''} onChange={e => setValue(e.target.value)} />;
}
