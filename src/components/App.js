import React, { Component } from 'react';
import './App.css';
import JSZip from 'jszip';
import { CSVLink } from "react-csv";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      clubName: "",
      mFile: "",
      fFile: "",
      out1: null,
      out2: null,
      step: 0,
      total: 0,
      completed: 0
    }
    this.fileUpload = this.fileUpload.bind(this);
    this.textInput = this.textInput.bind(this);
    this.getForm = this.getForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getLoading = this.getLoading.bind(this);
    this.getOutput = this.getOutput.bind(this);
    this.processData = this.processData.bind(this);
    this.getNames = this.getNames.bind(this);
  }
  fileUpload(e){
    if(e.target.files[0] && e.target.files[0].type!=="application/zip"){
      alert("please upload only zip files of the images");
      e.target.value = "";
    }else{
      this.setState({[e.target.name]: e.target.files[0]});
    }
  }
  textInput(e){
    this.setState({[e.target.name]: e.target.value});
  }
  async onSubmit(e){
    e.preventDefault();
    if(!this.state.mFile || !this.state.fFile || !this.state.clubName){
      alert("Please provide all the information");
      return;
    }
    this.setState({step:1});
    this.processData()
  }

  async processData(){
    let out = []
    const failed = []
    
    const mzip = await JSZip.loadAsync(this.state.mFile);
    let mNames = this.getNames(mzip);
    this.addSingles(mNames,"male",out);
    mNames = mNames.filter(name=>name.includes("&"))

    const fzip = await JSZip.loadAsync(this.state.fFile);
    let fNames = this.getNames(fzip);
    this.addSingles(fNames,"female",out);
    fNames = fNames.filter(name=>name.includes("&"))

    this.setState({total:fNames.length+mNames.length})
    this.setState({completed:out.length})

    let searched = []

    mNames = this.splitNames(mNames,failed);
    mNames =await this.getGenders(mNames,searched);

    fNames = this.splitNames(fNames,failed);
    fNames = await this.getGenders(fNames,searched);

    out = out.concat(this.mapNamesToOut(mNames,"male"));
    out = out.concat(this.mapNamesToOut(fNames,"female"));

    this.setState({out1:out});
    this.setState({out2:this.processData2(out)});
    this.setState({step:2});
  }
  processData2(objs){
    const out = []
    const ms = []
    const fs = []
    objs.forEach(obj => {
      let fullName = ""
      if(obj.gender==="male"){
        fullName = "Mr."+obj.first+" "+obj.last;
        ms.push(fullName);
      }
      else {
        const intro = obj.married==="true"?"Mrs.":"Ms.";
        fullName = intro+obj.first+" "+obj.last;
        fs.push(fullName);
      } 
      obj.fullName = fullName;     
    })
    objs.forEach(obj => {
      const wa = this.getWrongAnswers(obj.fullName,obj.gender==="female"?fs:ms)
      out.push({file:obj.file,name:obj.fullName,answer1:wa[0],answer2:wa[1],answer3:wa[2]});
    });
    return out;
  }
  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  } 
  getWrongAnswers(name,list){
    const out =[]
    this.shuffleArray(list);
    let i =0;
    while(out.length<3){
      if(list[i]!==name)
        out.push(list[i]);
      i++;
    }  
    return out;
  }
  mapNamesToOut(names, gender){
    const out = []
    names.forEach(name=>{

      const n0 = name[name.names[0]]
      const n1 = name[name.names[1]]
      let i = 0;
      if(n0.gender === n1.gender){
        if (n0.gender !== gender)
          i = (n0.probability > n1.probability)?1:0; // if wrong gender, choose one of lesser prob
        else
          i = (n0.probability < n1.probability)?1:0; // if right gender, choose one of more prob
      }else{
        i = (n0.gender===gender)?0:1; //if diff genders, choose correct gender
      }
      out.push(
        {
          file:name.file,
          first:name.names[i],
          last:this.removeEnd(name.file).split(",")[0],
          gender,
          married:"true"
        });
    });
    return out;
  }

  splitNames(names,failed){
    const splitNames = []
    names.forEach(file=>{
      try{
        let na = this.removeEnd(file).split(',')[1].split("&");
        na = na.map(n=>n.trim());
        splitNames.push({names:na,file});
      }
      catch(e){
        failed.push(file);
      }
    });
    return splitNames;
  }
  removeEnd(file){
    let out = file.split('-');
    out.pop();
    return out.join("");
  }
  addSingles(singles,gender,out){
    singles = singles.filter(name=>!name.includes("&"))
    singles.forEach(file=>{
      const name = this.removeEnd(file);
      const first = name.split(',')[1].trim();
      const last = name.split(',')[0].trim();
      out.push({file,first,last,gender,married:"false"})
    });
  }
  getNames(zip){
    const names = []
    try{
      zip.forEach((relativePath, zipEntry) => {
        if(!zipEntry.dir && !zipEntry.name.startsWith("__MACOSX"))
          names.push(zipEntry.name);
      });
    } catch(error){
      alert(error.message);
      this.setState({step:0});
    }    
    return names
  }
  async getGenders(names, searched){
    const out = []
    for (const n of names){
        
      let res0 = searched.filter(x=>x.name===n.names[0].split(' ')[0]);
      if (!res0.length){
        res0 = await (await fetch("https://api.genderize.io/?name="+n.names[0].split(' ')[0])).json();
        if(res0.error){
          alert(res0.error)
        }
        searched.push(res0);
      }else
        res0 = res0[0]; 
        
      let res1 = searched.filter(x=>x.name===n.names[1].split(' ')[0]);  
      if (!res1.length){
        res1 = await (await fetch("https://api.genderize.io/?name="+n.names[1].split(' ')[0])).json();
        if(res0.error){
          alert(res0.error)
        }
        searched.push(res1);
      }else
        res1 = res1[0]; 
        
      this.setState({completed:this.state.completed+2});
      out.push({names:n.names,[n.names[0]]:res0,[n.names[1]]:res1,file:n.file});
    }
    return out;
  }
  getForm(){
    return (
      <div className="App">
      <form>
        Club Name: <input type="text" value= {this.state.clubName} name="clubName" onChange={this.textInput}/>
        <br/>
        <br/>
        Male zip file: <input type="file" name="mFile" onChange={this.fileUpload}/>
        <br/>
        <br/>
        Female zip file: <input type="file" name="fFile" onChange={this.fileUpload}/>
        <br/>
        <br/>
        <input type="submit" value="Process" onClick={this.onSubmit}/>
      </form>
      </div>
    );
  }
  getLoading(){
    return (
      <div>
        Loading
        <br/>
        {"completed "+this.state.completed}
        <br/>
        {"of "+this.state.total}
      </div>
    )
  }
  getOutput(){
    return (
      <div>
        <CSVLink data={this.state.out1} filename={this.state.clubName+"_data_rich.csv"}>Download Name-Game CSV for {this.state.clubName} (data rich version)</CSVLink>
        <br/>
        <br/>
        <CSVLink data={this.state.out2} filename={this.state.clubName+"_wrong_answers.csv"}>Download Name-Game CSV for {this.state.clubName} (wrong answer generated version)</CSVLink>
      </div>
    )
  }
  render() {
    if(this.state.step===0)
      return this.getForm();
    else if(this.state.step===1)
      return this.getLoading()
    else
      return this.getOutput()
  }
}

export default App;
