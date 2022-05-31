#!/usr/bin/env node
import XLSX from "xlsx";
import fs from "fs";
import createWriter from 'csv-writer';
function parse(filename) {
 const excelData=XLSX.readFile(filename);
 return Object.keys(excelData.Sheets).map((name)=>({
  name,
  data:XLSX.utils.sheet_to_json(excelData.Sheets[name]),
 }));
};

function writeIntoCSVFile(finalResult)
{
    const createCsvWriter=createWriter.createObjectCsvWriter;
    const writer=createCsvWriter({
        path:'./bin/result.csv',
        header:[
            {id:'Name',title:'Name'},
            {id:'repo',title:'Repo'},
            {id:'version',title:'Version'},
            {id:'versionSatisfied',title:'Version-Satisfied'}
        ]
    });
    writer.writeRecords(finalResult).then(()=>{console.log("Data Written onto File")});
}
async function helper(dependency,version)
{
    const jsonFiles=["./config/dyte-react-sample-app.json","./config/dyte-js-sample-app.json","./config/dyte-sample-app-backend.json"]
    var data = [];
    for(var i=0;i<jsonFiles.length;i++)
    {
        
        const d=fs.readFileSync(jsonFiles[i],'utf-8');
        const fileData=JSON.parse(d);
        var newData={version:"",versionSatisfied:""};
        newData.version=fileData.dependencies[dependency].substring(1);
        newData.versionSatisfied=(newData.version>=version)?"true":"false";
        data=[...data,newData]
    }
    return data;
}
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
            var sheetData=[];
            parse("./bin/test.csv").forEach((element)=>{                
                for(var i=0;i<element.data.length;i++)
                {
                    var name=element.data[i].Name;
                    var repoName=element.data[i].repo;
                    sheetData=[...sheetData,{name,repoName}];
                }
            });
            var result=await helper(dependency,version);
            //merge sheetData and result and write into result.csv
            var finalCSVResult=[];
            for(var i=0;i<sheetData.length;i++)
            {
                finalCSVResult=[...finalCSVResult,{
                    Name:sheetData[i].name,
                    repo:sheetData[i].repoName,
                    version:result[i].version,
                    versionSatisfied:result[i].versionSatisfied
                }]
            }
            //console.log(finalCSVResult);
            writeIntoCSVFile(finalCSVResult);

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

