export function tr(msg:string, alertOn=false, consoleOn:boolean=true)
{
  if (consoleOn)
    console.log(msg);

  if (alertOn)
    alert(msg);
}