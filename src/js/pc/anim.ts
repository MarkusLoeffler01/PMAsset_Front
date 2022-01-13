import {ClearTable, enableBtn, foc, getInputValues, ResetFields, tbody} from "../anim.js";
import {Bildschirm, Item, PC} from "../interface";
import { getData, getMonitors, setData } from "./backend.js";

const genPasswd = (length: number) =>
{
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890\"\'§$%&/()=\\`´!#-_<>!+~?°^';
    let passwd = "";
    for(let i = 0; i < length; i++)
    {
        passwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return passwd;
}

export const ShowPassword = (elem: HTMLElement) =>
{
    
    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    const passwd = grandparent.getElementsByClassName("bpasswd")[0] as HTMLInputElement;
    

    if(passwd.type == "password") 
    {
        passwd.type = "text";
        elem.innerHTML = "visibility_off";
        return;
    }
    passwd.type = "password";
    elem.innerHTML = "visibility";
}

export const GeneratePassword = (elem: HTMLElement) =>
{
    const grandparent = elem.parentElement as HTMLTableCellElement;
    const passwd = grandparent.getElementsByTagName("input")[0] as HTMLInputElement;

    passwd.value = genPasswd(15);
    enableBtn();

}

export let devices:PC[] = [];
export const setDevices = async(dev:PC[]) => devices = dev; 

export const getDevice = async(it_nr: string) =>
{
    return devices.filter(device => device.it_nr.includes(it_nr));
}

export const SearchDevice = async(it_nr: string) =>
 {
    const devs = await getDevice(it_nr);
    console.log(devs);
    ClearTable();
     devs.forEach(device => AddRow(device));
 }

 const MakeTemplate = async (values: PC): Promise<HTMLTableRowElement> =>
 {


    const template = document.createElement("tr");
    template.setAttribute("onmouseover", "main.foc(this)");
    template.setAttribute("onmouseout", "main.unfoc(this)");


    //Make a loop where we clone the template, put the values in and append it to the temp variable
    Object.keys(values).forEach(key =>
    {
        const temp = document.createElement("td");
        temp.classList.add("border-2", "border-black", "duration-500", "transition", "text-center");
        switch(key)
        {
            case "it_nr": temp.innerText = values.it_nr as any; temp.id = "IT_NR"; break;
            case "type": temp.innerText = values.type as any; temp.id="TYP"; break;
            case "hersteller": temp.innerText = values.hersteller as any; temp.id="HERSTELLER"; break;
            case "seriennummer": temp.innerText = values.seriennummer as any; temp.id="SERIENNUMMER"; break;
            case "standort": temp.innerText = values.standort as any; temp.id="STANDORT"; break;
            case "status": temp.innerText = values.status as any; temp.id="STATUS"; break;
            case "equipment": temp.id="EQUIPMENT"; break;
            case "besitzer": 
            const a = document.createElement("a");
            a.href = "#";
            a.classList.add("text-red-900", "hover:text-green-900");
            temp.innerText = values.besitzer as any; 
            temp.id="BESITZER";
            break;
            case "form": temp.innerText = values.form as any; temp.id="FORM"; break;
            case "passwort": 
            const pwf = document.createElement("input"); pwf.type = "password"; pwf.disabled = true; pwf.value = values.passwort as any; pwf.classList.add("bpasswd");
            temp.innerHTML = pwf.outerHTML; temp.id="PASSWORT"; break;
        }
        console.log(temp); 
        
        template.appendChild(temp); 
    });
    console.log(template);
    const sortedtemplate = document.createElement("tr");
    sortedtemplate.setAttribute("onmouseover", "main.foc(this)");
    sortedtemplate.setAttribute("onmouseout", "main.unfoc(this)");
    const queries = ["#IT_NR", "#TYP", "#HERSTELLER", "#SERIENNUMMER", "#EQUIPMENT", "#STANDORT", "#STATUS", "#BESITZER", "#FORM", "#PASSWORT"];
    queries.forEach(query => sortedtemplate.appendChild(template.querySelector(query) as HTMLTableCellElement));

    const icons = createIcons();
    sortedtemplate.appendChild(icons);

    return sortedtemplate;
 }

 export const createIcons = () => {
    const icons = document.createElement("td"); icons.classList.add("icons");
    const a1 = document.createElement("a");
    const a2 = document.createElement("a");
    const a3 = document.createElement("a");
    const i1 = document.createElement("i"); i1.classList.add("mx-2");
    const i2 = document.createElement("i"); i2.classList.add("mx-2");
    // const i3 = document.createElement("i");

    a1.classList.add("text-gray-500", "text-gray-500", "hover:text-gray-100"); a1.href = "#";
    a2.classList.add("text-yellow-400",  "hover:text-gray-100", "mx-2"); a2.href = "#";
    a3.classList.add("text-red-400", "hover:text-gray-100"); a3.href = "#";

    i1.classList.add("material-icons-outlined", "text-base"); i1.innerText = "visibility"; i1.setAttribute("onclick", "PC.ShowPassword(this);");
    i2.classList.add("material-icons-outlined", "text-base"); i2.innerText = "edit"; i2.setAttribute("onclick", "main.EditEntry(this);");
    // i3.classList.add("material-icons-round", "text-base"); i3.innerText = "delete_outline";

    a1.appendChild(i1);
    a2.appendChild(i2);
    // a3.appendChild(i3);

    icons.appendChild(a1);
    icons.appendChild(a2);
    icons.appendChild(a3);

    return icons;
 }


 export const AddMonRow = (_values: Bildschirm) =>
 {
     const MonTBody = document.getElementById("MonTBody") as HTMLTableElement;
     const tr = document.createElement("tr");
     tr.classList.add("HardwareSearchResult");

     const checkbox = document.createElement("td");
     checkbox.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let checkbox2 = document.createElement("input");
     checkbox2.type = "checkbox";
     checkbox2.classList.add("moncheckbox");
     checkbox.append(checkbox2);


     let td0 = document.createElement("td"); td0.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td1 = document.createElement("td"); td1.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td2 = document.createElement("td"); td2.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td3 = document.createElement("td"); td3.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td4 = document.createElement("td"); td4.classList.add("border-t", "border-gray-200", "px-4", "py-2");
     let td5 = document.createElement("td"); td5.classList.add("border-t", "border-gray-200", "px-4", "py-2");

     td0.innerText = _values.it_nr;
     td1.innerText = _values.seriennummer;
     td2.innerText = _values.type;
     td3.innerText = _values.hersteller;
     td4.innerText = _values.model;
     td5.innerText = _values.status;
     
     tr.append(checkbox, td0, td1, td2, td3, td4, td5);
     MonTBody.append(tr);
     console.log(tr);
 }

 export let currentRow = "";
 export const changeCurrentRow = (value: string) =>
 {
        currentRow = value;
 } 

 export const DoneMon = async () => {
     const tbody = document.getElementById("MonTBody")!;
     //Get the tr from the tbody and check if the checkbox in first td is ticked
     for(let i = 0; i < tbody.children.length; i++)
     {
         const tr = tbody.children[i];
         const checkbox = tr.children[0].children[0] as HTMLInputElement;
         if(checkbox.checked)
         {
             const id = tr.children[1].innerHTML;
            //  const seriennummer = tr.children[2].innerText;
            //  const type = tr.children[3].innerText;
            //  const hersteller = tr.children[4].innerText;
            //  const model = tr.children[5].innerText;
            //  const status = tr.children[6].innerText;
            //  const bildschirm = new Bildschirm(id, seriennummer, type, hersteller, model, status);
             const input = document.createElement("input");
             input.classList.add("readonly");
             //Right click on the input field, which will prompt the user to remove the input field
            input.setAttribute("oncontextmenu", "if(confirm('Möchten Sie diesen Bildschirm vom PC trennen?')) {this.remove(); return false;}");

             switch(currentRow)
            {
                case "input": document.getElementById("inputvalues")!.children[4].append(input); break;
                default: 
                //Get the row from the table where the itnr matches and add the input field
                const row = SearchRowByTdInnerText(currentRow);
                if(row == null) return alert("Error");
                row.children[4].append(input);
            }
         }
     }
 }

 export const SearchRowByTdInnerText = (value: string) =>
 {
        const tbody = document.getElementById("MonTBody")!;
        for(let i = 0; i < tbody.children.length; i++)
        {
            const tr = tbody.children[i];
            const td = tr.children[0];
            if(td.textContent?.includes(value) || td.textContent == value)
            {
                return tr as HTMLTableRowElement;
            }
        }
        return null;
 }

 

 export const RemoveInputField = (element: HTMLInputElement) => {
     element.remove();
 };

 export const LinkWithPC = async (pcit: string, monit: string) => {

 };

 export const AddRow = async (_values?: PC) =>
{
    // const newRow = tbody.rows[1].cloneNode(true) as HTMLTableRowElement;
    let values:PC;
    
    

    if(!_values)
    {   
        values = await getInputValues("PC") as PC;
        if(devices.filter(e => e.it_nr == values.it_nr).length > 0) return alert("PC ist bereits in der Liste vorhanden!");
        //@ts-ignore
        if(values.equipment === undefined) values.equipment = [];
        //Es wurden keine Values mitgegeben, also... in die DB
        setData(values, {method: "PUT", device: values});
    }
    else values = _values;

    if(!values.equipment) values.equipment = [];
    //@ts-ignore
    if(typeof values.equipment == "string") values.equipment = JSON.parse(values.equipment);
    console.warn(values);
    const newRow = await MakeTemplate(values);
    //Set the values into the new row
    Object.keys(values).forEach((key, index) =>
        {
            if(key == "kind") return;
            const template = newRow.getElementsByTagName("td")[index];

            switch(index)
            {
                case 0: template.innerText = values.it_nr as any; break;
                case 1: template.innerText = values.type as any; break;
                case 2: template.innerText = values.hersteller as any; break;
                case 3: template.innerText = values.seriennummer as any; break;
                case 4: 
                const button = document.createElement("button");
                button.id = "open-btn";
                button.setAttribute("onclick", "main.openform(this.parentElement.parentElement);");
                button.classList.add("w-full", "text-center");
                button.innerText = "Hinzufügen";
                template.append(button);

                values.equipment.forEach(equipment =>
                    {
                        const input = document.createElement("input");
                        input.value = equipment;
                        input.classList.add("text-center");
                        input.setAttribute("readonly", "");
                        input.setAttribute("oncontextmenu", "if(confirm('Möchten Sie diesen Bildschirm vom PC trennen?')) {this.remove();} return false;");
                        template.append(input);
                        template.append(document.createElement("br"));
                    });
                
                break;
                case 5: template.innerText = values.standort as any; break;
                case 6: template.innerText = values.status as any; break;
                case 7: template.innerText = values.besitzer as any; break;
                case 8: template.innerText = values.form as any; break;
                case 9: (template.children[0] as HTMLInputElement).value = values.passwort as any; break;
            }

        // switch(key)
        // {
        //     case "it_nr": template.innerText = values.it_nr as any; break;
        //     case "type": template.innerText = values.type as any; break;
        //     case "hersteller": template.innerText = values.hersteller as any; break;
        //     case "seriennummer": template.innerText = values.seriennummer as any; break;
        //     case "standort": template.innerText = values.standort as any; break;
        //     case "status": template.innerText = values.status as any; break;
        //     case "besitzer":
        //     const a = document.createElement("a");
        //     a.href = "#";
        //     a.classList.add("text-red-900", "hover:text-green-900");
        //     template.innerText = values.besitzer as any;
        //     break;
        //     case "form": template.innerText = values.form as any; break;
        //     case "passwort": template.innerText = values.passwort as any; break;
        // }
    });
    
    //Add the new row to the table
    $("#tbody tr:first").after(newRow);
    //Reset the values in the input fields
    ResetFields();
    

    
    // if(_values) values = _values;
    // if(values == undefined) return;    
    // Array.from(newRow.cells).forEach(async (cell, index) => {
    //     if(index == 0) cell.innerText = ((values as string[])[index]).slice(3);
    //     else if(index == 3) cell.innerText = "Bildschirm";
    //     else if(index == 6) cell.innerText = values![6];
    //     else if(index == 8) { 
    //         let input = document.createElement("input"); 
    //         input.type = "password";
    //         input.classList.add("bpasswd");
    //         input.value = values![8] || "";
    //         cell.innerHTML = "";
    //         cell.appendChild(input);
    //  }
    //     else if(index == 9) return;
    //     else cell.innerText = values![index];
    // });
    
    
};



//Make a function which gets the Monitors from the backend and log them
export const GetMonitors = async (currentRow: string) =>
{
    document.getElementById("MonTBody")!.innerHTML = "";
    const data = await getMonitors();
    console.error(data);
    if(!data) return console.log("Ich geh Mal");
    
    const notAvaiable = ["Bestellt", "Aktiv", "Defekt", "Verschrottet"];
    
    data.forEach(entry =>
    {
        if(notAvaiable.includes(entry.status)) return;
        AddMonRow(entry);
        console.log(entry);
    });
}


// Grabs all the Elements by their IDs which we had given them
let modal = document.getElementById("my-modal") as HTMLDivElement;

let okbtn = document.getElementById("ok-btn") as HTMLButtonElement;

export const openform = (row: HTMLTableRowElement) => {

    GetMonitors(currentRow);
    if(row.children[0]?.children[0]?.children[0]?.hasAttribute("value")) changeCurrentRow((row.children[0]!.children[0]!.children[0]! as HTMLInputElement).value);
    else changeCurrentRow(row.children[0].textContent as string);

    
    if(currentRow == "IT00") return alert("Dies IT-Nr ist nicht vollständig");
    modal.style.display = "block";
    console.log(currentRow);
};

//We want the modal to close when the OK button is clicked
if(document.location.pathname.toLocaleLowerCase().includes("/pc")) okbtn.onclick = function () {
    modal.style.display = "none";

    let mons = [];
    //Check if the checkboxes are checked
    Array.prototype.forEach.call(document.getElementsByClassName("moncheckbox"), (element: HTMLInputElement) => {
        if(element.checked)
        {
            const Mon_ITNR = element.parentElement!.parentElement!.children[1].textContent as string;
            mons.push(Mon_ITNR);
        }
    });

    //Set the new equipment in the database
    

    //Untick all the checkboxes in the modal
    //Egal, weil das Element sich eh neu aufbauen wird
    // Array.prototype.forEach.call(document.getElementsByClassName("moncheckbox"), function (item: HTMLInputElement) {
    //     item.checked = false;
    // });
}

// The modal will close when the user clicks anywhere outside the modal
if(document.location.pathname.toLocaleLowerCase().includes("/pc")) window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const SNSearch = document.getElementById("HardwareSearchInput") as HTMLInputElement;
const HWSearch = document.getElementById("HardwareSearchResult") as HTMLTableRowElement;

const classList =
[
    "border-2",
    "border-black",
    "duration-500",
    "transition",
    "text-center"
];

if(document.location.pathname.toLocaleLowerCase().includes("/pc")) SNSearch.addEventListener("keyup", function () {
    let value = this.value.toUpperCase();
    if(value === undefined || value.length <3) return;
    // console.log(value);
    HWSearch.innerHTML = "";
    let result:BSP[] = [];
    if(value.startsWith("IT")) result = BSPDev.filter(element => element.ITNr.startsWith("02-"+value));
    else if(value.startsWith("02-IT")) result = BSPDev.filter(element => element.ITNr.startsWith(value));
    else result = BSPDev.filter(element => element.SN.startsWith(value));
    console.log(result);
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    result.forEach(element => {
        let tr = document.createElement("tr");

        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let td5 = document.createElement("td");
        let td6 = document.createElement("td");

        td1.innerHTML = checkbox.outerHTML;
        td2.innerText = element.ITNr;
        td3.innerText = element.SN;
        td4.innerText = "Bildschirm";
        td5.innerText = element.Hersteller;
        td6.innerText = element.Status;

        classList.forEach(element => {
            td1.classList.add(element)
            td2.classList.add(element)
            td3.classList.add(element)
            td4.classList.add(element)
            td5.classList.add(element)
            td6.classList.add(element);
        });
        
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

        HWSearch.appendChild(tr);
    });
});

interface BSP {
    ITNr: string;
    SN: string;
    Hersteller: string;
    Status: string;
}

const BSPDev:BSP[] = 
[
    {
        ITNr: "02-IT002021",
        SN: "218737823892",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002022",
        SN: "218737823434",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002023",
        SN: "218737848293",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002024",
        SN: "218737899843",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002025",
        SN: "218737833445",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002026",
        SN: "218737811234",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    },
    {
        ITNr: "02-IT002027",
        SN: "218737822345",
        Hersteller: "Samsung",
        Status: "Inaktiv"
    }
];