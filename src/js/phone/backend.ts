import { ClearTable } from "../anim.js";
import { insertRequest, request, ShowError } from "../backend.js";
import { Phone, pushrequest } from "../interface";
import { AddRow, setDevices } from "./anim.js";
import { res_phone } from "./interface";


export const getData = async() =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");

    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    let res = request("getEntries", {method: "getEntries", SessionID: SessionID, username: username, type: "Phone"}, async (res: {message: string, status: number}, err: {message: string, status: number}) =>
    {
        if(err)
        {
            ShowError(err.message, err.status);
            throw new Error(err.message);
        }
        console.debug(res);

        console.debug(res.message);
        const data = JSON.parse(res.message) as res_phone[];
        //convert the data to the pc interface
        const Phones: Phone[] = [];
        data.forEach((element) => {
            Phones.push(
                {
                    kind: "Phone",
                    it_nr: element.ITNR as any,
                    model: element.MODEL as any,  
                    seriennummer: element.SN,
                    standort: element.STANDORT,
                    status: element.STATUS as any,
                    besitzer: element.BESITZER || "",
                    form: element.FORM as any
                });
        });
        setDevices(Phones);
        if(document.location.pathname.toLowerCase().includes("/phone")) Phones.forEach(entry => AddRow(entry));
    });
    if(document.location.pathname.toLowerCase().includes("/phone")) ClearTable();
    return res;
}

export const setData = async (data: Phone, method: pushrequest) =>
{
    const username = window.sessionStorage.getItem("username");
    const SessionID = window.sessionStorage.getItem("SessionID");
    if(username == null || SessionID == null) throw new Error("No SessionID or username found");
    insertRequest("setData", {method: method.method, SessionID: SessionID, username: username, device: {
        kind: "Phone",
        it_nr: data.it_nr,
        seriennummer: data.seriennummer,
        model: data.model,
        standort: data.standort,
        status: data.status,
        besitzer: data.besitzer || "",
        form: data.form || "",
    }}, (res: {message: string, status: number}, err: {message: string, status: number}) => {
        if(err)
        {
            ShowError(err.message, err.status);
            throw new Error(err.message);
        }
        return res;
    });
}