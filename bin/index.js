#!/usr/bin/env node
import XLSX from "xlsx";
import fs from "fs";
import arg from 'arg';
import createWriter from 'csv-writer';
function parse(filename) {
 const excelData=XLSX.readFile(filename);
 return Object.keys(excelData.Sheets).map((name)=>({
  name,
  data:XLSX.utils.sheet_to_json(excelData.Sheets[name]),
 }));
};

function parseArguments(rawArgs)
{
    const args=arg(
        {
            '-u':Boolean,
            '-i':Boolean

        },
        {
            argv:rawArgs.slice(2),
        }
    );
        return{
            
            input:args['-i']||false,
            update:args['-u']||false,
            template:args._[0],
            inputFile:args._[1]


        };
}
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
//parse the arguments
async function main()
{
let options=parseArguments(process.argv);
console.log(options);
const argument=process.argv[2];
if(options.input)
{
    const file="./bin/"+options.template+".csv";
    const input=options.inputFile.split("@");
    const dependency=input[0];
    const version=input[1];
    var fileExists=true;
    //write a function to check if the template is valid
    if(fileExists)
    {   
            var sheetData=[];
            parse(file).forEach((element)=>{                
                for(var i=0;i<element.data.length;i++)
                {
                    var name=element.data[i].Name;
                    var repoName=element.data[i].repo;
                    sheetData=[...sheetData,{name,repoName}];
                }
            });
            var result=await helper(dependency,version);
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
if(options.update)
{
    console.log("perform the Append Operation for your update pr");
}
else if(!options.input && !options.update)
{
    console.log("No Arguements are passed.Give Instructions for the arguements");
}
}

main();
