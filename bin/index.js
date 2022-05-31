#!/usr/bin/env node
import XLSX from "xlsx";
import fs from "fs";
//const sampleApp=require("./config/dyte-js-sample-app.json");
//const reactApp=require("./config/dyte-react-sample-app.json");
//const sampleAppBackend=require("./config/dyte-js-sample-app-backend.json");
function cli(filename) {
 const excelData=XLSX.readFile(filename);
 return Object.keys(excelData.Sheets).map((name)=>({
  name,
  data:XLSX.utils.sheet_to_json(excelData.Sheets[name]),
 }));
};

const argument=process.argv[2];
if(argument=='-i')
{
    const file=process.argv[3];
    const input=process.argv[4].split("@");
    const dependency=input[0];
    const version=input[1];
    console.log("The dependency to be checked is:"+dependency);
    console.log("The version to be checked is:"+version);



    if(file=="test")
    {
        //convert all the json files to js object notation
        fs.readFile('./config/dyte-react-sample-app.json','utf-8',(err,jsonString)=>{
            if(err)
                console.log(err);
            else
            {
                const data=JSON.parse(jsonString);
                if(dependency=="axios")
                {
                    const value=data.dependencies.axios; 
                    const newValue=value.substring(1);
                    if(version>newValue)
                        console.log("New Version Available");
                    else if(version<newValue)
                        console.log("Update Required");
                    else
                        console.log("Up to date");
                    
                    console.log(newValue);
                        
                }
            }
        });        
       /*cli("./bin/test.xlsx").forEach((element)=>{
            console.log(element.data);
         });*/
    }
    else
    {
        console.log("File Does not exist");
    }

}
else
{
    console.log("No Arguements are passed");
}

