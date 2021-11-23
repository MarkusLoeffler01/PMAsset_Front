const btn = document.querySelector('.mobile-menu-button');
const content = document.querySelector('#content');
const sidebar = document.querySelector('.sidebar');
const table = document.getElementById("table") as HTMLTableElement;
const tbody = document.getElementById('tbody') as HTMLTableElement;
const thead = document.getElementById('thead') as HTMLTableElement;

import { InputName } from "./interface";
import { uwu } from "./cart.js";
import { MonitorHersteller, PCTypen, PhoneTypen, StatusTypen } from "./values.js";

uwu();

//add our event listener for the click

console.log("ready");

btn?.addEventListener('click', () => {
    console.log('clicked');
    // content?.classList.toggle('-translate-x-0');
    // content?.classList.toggle('md:translate-x-0');



    // sidebar?.classList.toggle('-translate-x-0');
    // sidebar?.classList.toggle('md:translate-x-0');


    sidebar?.classList.toggle('-ml-64');
});


export const foc = async (element: HTMLTableRowElement) => {
    for (let j = 0; j < element.cells.length; j++) {
        let cell = element.cells[j];
        if(cell.classList.contains("icons")) continue;
        cell.classList.add('bg-yellow-600');
    }
};

export const unfoc = async (element: HTMLTableRowElement) => {
    for (let j = 0; j < element.cells.length; j++) {
        let cell = element.cells[j];
        if(cell.classList.contains("icons")) continue;
        cell.classList.remove('bg-yellow-600');
    }
}

export const ConvToInput = async (element: HTMLTableCellElement) => {
    console.log("ConvToInput");
    let input = new HTMLInputElement();
    input.type = element.getAttribute("name") || "unknown" as InputName;
    switch (input.type as InputName) {
        case "IT_Nr":
            input.placeholder = "0X-IT00XXXX";
            input.title = "01 => Laptop\n02 => Bildschirm\n03 => Konferenzerät\n04 => Phone";
            break;
        case "Seriennummer":
            input.placeholder = "XXXXXXXXXXXX";
            input.title = "Bitte hier die Seriennummer eingeben"
            break;
        case "Typ":
            return;
            //Der Typ sollte automatisch gesetzt werden
            let sel = new HTMLSelectElement();
            sel.title = "Bitte hier den Typ auswählen";
            sel.options.add(new Option("Laptop", "01"));
            break;
        case "text": break;
        default: break;
    }
    input.value = element.innerText;
    input.placeholder = ""

};

const ConvToCell = async (element: HTMLInputElement) => {

};

const newRowNames =
    [
        "IT_Nr",
        "Typ",
        "Seriennummer"
    ];

// export const AddRow = async () => {

//     await MoveRow();
//     let row = document.createElement("tr");
//     for (let i = 0; i < newRowNames.length; i++) {
//         let cell = document.createElement("td");
//         cell.classList.add("border-2");
//         cell.classList.add("border-black");
//         cell.setAttribute("name", newRowNames[i]);
//         cell.setAttribute("onfocus", "main.ConvToInput(this);");
//         cell.setAttribute("onblur", "main.ConvToCell(this);");
//         row.appendChild(cell);
//     }
//     for (let i = 0; i < 5; i++) {
//         let cell = document.createElement("td");
//         cell.classList.add("border-2");
//         cell.classList.add("border-black");
//         cell.setAttribute("name", "text");
//         cell.setAttribute("onfocus", "main.ConvToInput(this);");
//         cell.setAttribute("onblur", "main.ConvToCell(this);");
//         row.appendChild(cell);
//     }
//     /** Statt AppendChild, nutze insertBefore, um am Anfang (ganz oben) einzufügen */
//     tbody.insertBefore(row, tbody.firstChild);
// };


export const AddRow = async () =>
{
    const newRow = tbody.rows[1].cloneNode(true) as HTMLTableRowElement;
    let values = await getInputValues();
    Array.from(newRow.cells).forEach(async (cell, index) => {
        if(index == 0) cell.innerText = (values[index] as string).slice(3);
        if(index == 3) cell.innerText = "Bildschirm";
        if(index == 9) return;
    });
    console.log(newRow);
    
    $("#tbody tr:first").after(newRow);
};

const getInputValues = async () => 
{
    let inputrow = tbody.rows[0];
    let cells = Array.from(inputrow.cells);
    let values = cells.map((cell, index) => {
        if(index == 0) return (cell.children[0].children[0] as HTMLInputElement).value;
        if(index == 3 || index == 9) return null;
        if(index == 1 || index == 5 || index == 7) return (cell.children[0] as HTMLSelectElement).selectedOptions[0].value;
        if(index == 8 )return (cell.children[1] as HTMLInputElement).value;
        return (cell.children[0] as HTMLInputElement).value;
    });
    return values;
}

//Create a function which returns if the value is odd
const isEven = (i: number) => i % 2 === 0;

const tdRowClasses =
    [
        "border-2",
        "border-black",
        "duration-500",
        "transition",
        "text-center"
    ];

/** Hier wird der Input in eine neue feste Zeile umgewandelt und dem Table hinzugefügt */
const MoveRow = async () => {
    let newrow = document.createElement("tr");
    newrow.setAttribute("onmouseover", "main.foc(this);");
    newrow.setAttribute("onmouseout", "main.unfoc(this);");
    for (let i = 0; i < newRowNames.length; i++) {
        let cell = document.createElement("td");
        tdRowClasses.forEach(element => cell.classList.add(element));
        cell.setAttribute("name", newRowNames[i]);
        cell.innerText = getCellValue(i);
        newrow.appendChild(cell);
    }
    for (let i = 0; i < 5; i++) {
        let cell = document.createElement("td");
        cell.classList.add("border-2");
        cell.classList.add("border-black");
        cell.setAttribute("name", "text");
        cell.setAttribute("onfocus", "main.ConvToInput(this);");
        cell.setAttribute("onblur", "main.ConvToCell(this);");
        newrow.appendChild(cell);
    }
    tbody.rows[0] = newrow;
}


const getCellValue = (index: number) => {
    let inputrow = tbody.rows[0];
    let cell = inputrow.cells[index];
    return cell.innerText;
}

export const checkITNr = async (element: HTMLTableCellElement) => {
    if (element.innerText.length < 2) return;
    let prefix = element.innerText.substring(0, 2);
    switch (prefix) {
        case "01": setInputType("PC"); break;
        case "02": setInputType("Monitor"); break;
        case "03": setInputType("Conference"); break;
        case "04": setInputType("Phone"); break;
    }
}


(() => {
    const select = document.getElementById("SelectInputTyp") as HTMLSelectElement;
    PCTypen.forEach(element => select.options.add(new Option(element, element)));

    const select2 = document.getElementById("SelectInputStatus") as HTMLSelectElement;
    StatusTypen.forEach(element => select2.options.add(new Option(element, element)));

    Array.prototype.forEach.call(select2.options, function(item: HTMLOptionElement) {
        item.style.textAlignLast = "center";
    })
})();


export const AddEquipment = () => {
    //Show a popup window
    const popup = document.createElement("div") as HTMLDivElement;
    popup.style.display = "block";
    popup.style.opacity = "1";
    popup.style.position = "fixed";
    popup.style.visibility = "visible";
    document.body.appendChild(popup);
};


const setInputType = async (type: "PC" | "Monitor" | "Conference" | "Phone") => {
    const select = document.getElementById("SelectInputTyp") as HTMLSelectElement;
    const EquipmentCell = document.getElementsByName("Equipment")[0] as HTMLTableCellElement;
    switch (type) {
        case "PC":
            PCTypen.forEach(element => select.options.add(new Option(element, PCTypen.indexOf(element).toString())));
            break;

        case "Monitor":
            const sel = document.createElement("select");
            tbody.rows[0].cells[3].appendChild(sel);
            thead.rows[0].cells[3].innerText = "Hersteller";
            MonitorHersteller.forEach(element => sel.options.add(new Option(element, MonitorHersteller.indexOf(element).toString())));
    }
};

$("#itinput").keydown(function (e) {
    console.log(e);
    if (/^\d+$/.test(e.key) == false && e.key != "Backspace") return e.preventDefault();
    let oldvalue = $(this).val() as string;
    let field = this as HTMLInputElement;
    setTimeout(function () {
        if (field.value.indexOf('01-IT00') !== 0) {
            $(field).val(oldvalue);
        }
    }, 1);
});

// Grabs all the Elements by their IDs which we had given them
let modal = document.getElementById("my-modal") as HTMLDivElement;

let openbtn = document.getElementById("open-btn") as HTMLButtonElement;

let okbtn = document.getElementById("ok-btn") as HTMLButtonElement;

// We want the modal to open when the Open button is clicked
openbtn.onclick = function () {
    modal.style.display = "block";
}
//We want the modal to close when the OK button is clicked
okbtn.onclick = function () {
    modal.style.display = "none";
}

// The modal will close when the user clicks anywhere outside the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

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
]

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

SNSearch.addEventListener("keyup", function () {
    console.log("Hallo");
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


//Create a function which will take every HTML Element in the body and apply the "upper" class

export const CreateForm = (elem: HTMLOptionElement) => 
{

}

export const ShowPassword = (elem: HTMLElement) =>
{
    
    const grandparent = elem.parentElement?.parentElement?.parentElement as HTMLTableRowElement;
    console.log(grandparent);
    const passwd = grandparent.getElementsByClassName("bpasswd")[0] as HTMLInputElement;
    console.log(passwd);
    

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
    console.log(grandparent);
    const passwd = grandparent.getElementsByTagName("input")[0] as HTMLInputElement;

    passwd.value = genPasswd(15);
    enableBtn();

}

const DoneBTN = document.getElementById("DoneBTN");

export const enableBtn = () =>
{
    console.log("00");
    
    if(validateInput()) {
        console.log(11);
        
        if(DoneBTN != null) 
        {
            console.log(12)
            DoneBTN.removeAttribute("disabled");
            DoneBTN.parentElement?.classList.add("text-green-400");
            DoneBTN.parentElement?.classList.remove("text-red-400");
            DoneBTN.innerHTML = "done";
        }
    }
    else
    {
        console.log(21);
        //user darf nicht fortfahren
        if(DoneBTN != null) 
        {
            console.log(22)
            DoneBTN.setAttribute("disabled", "");
            DoneBTN.parentElement?.classList.remove("text-green-400");
            DoneBTN.parentElement?.classList.add("text-red-400");
            DoneBTN.innerHTML = "close";
        }
    } 
}

export const ResetFields = () =>
{
    const row = tbody.rows[0];
    //Get all elements with the class "temp" from the row and set their value to ""
    Array.from(row.getElementsByClassName("temp")).forEach(element => {
        if((element as HTMLInputElement).id == "itinput") (element as HTMLInputElement).value = "01-IT00";
        else (element as HTMLInputElement).value = "";
    });
}

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

const itinput = document.getElementById("itinput") as HTMLInputElement;

export const validateInput = () =>
{
    if(itinput.value.length != itinput.maxLength) return false;
    let valid = true;
    
    Array.from(tbody.rows[0].cells).forEach(element => {
        const parent = element.children;
        if(parent == null) return;
        Array.from(parent).forEach(el => {
            if(el.tagName != "INPUT" && el.tagName != "SELECT") return;
            if((el as HTMLInputElement).value == "") valid = false;

        });
    });
    return valid;
}


const keys = {
    ctrl: false,
    shift: false,
    i: false,
    F12: false,
    fuse: false
};

document.onkeydown = (e) =>
{
    if(keys.fuse) return;
    if(e.key == "F12") keys.F12 = true;
    if(e.key === "Control") keys.ctrl = true;
    if(e.key === "Shift") keys.shift = true;
    if(e.key === "I") keys.i = true;

    if(((keys.ctrl && keys.shift && keys.i) || keys.F12) && !keys.fuse)
    {
        console.warn('%cStop!', 'color: red; font-size: 60px; font-weight: bold;');
        console.log("%cFalls dich jemand dazu aufgefordert hat, etwas zu kopieren und hier einzufügen, handelt es sich in 11 von 10 Fällen um einen Betrugsversuch.", 'font-size: 30px; font-weight: bold;');
        console.log("%cEtwas hier einzufügen könnte die Seite verhunzen oder Angreifern Zugang verschaffen!", 'font-size: 30px; font-weight: bold;');
        keys.fuse = true;
    }
    console.log(keys);
    
};

document.onkeyup = (e) =>
{
    if(e.key === "Control") keys.ctrl = false;
    if(e.key === "Shift") keys.shift = false;
    if(e.key === "i") keys.i = false;
    if(e.key === "F12") keys.F12 = false;
}