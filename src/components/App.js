import React, { Component } from 'react';
import './App.css';
import JSZip from 'jszip';
import { debug } from 'util';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      clubName: "",
      mFile: "",
      fFile: "",
      out: null,
      mNames: [],
      step: 0
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
    if(e.target.files[0].type!=="application/zip"){
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
    console.log(this.state.mFile)
    e.preventDefault();
    this.setState({step:1});
    this.processData()
  }

  async processData(){
    const out = []
    const failed = []
    
    const mzip = await JSZip.loadAsync(this.state.mFile);
    const fzip = await JSZip.loadAsync(this.state.fFile);
    let mNames = this.getNames(mzip);
    this.addSingles(mNames,"Male",out);
    mNames = mNames.filter(name=>name.includes("&"))

    let fNames = this.getNames(fzip);
    this.addSingles(fNames,"Female",out);
    fNames = fNames.filter(name=>name.includes("&"))

    console.log(out);
    console.log(mNames);
    console.log(fNames);

    const genNames = []
    mNames.forEach(file=>{
      try{
        const names = this.removeEnd(file).split(',')[1].split("&");
        genNames.push(names);
      }
      catch(e){
        failed.push(file);
      }
    });
    console.log(genNames);
    let outGenNames = []
    this.getGenders(genNames,outGenNames);
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
      const first = name.split(',')[1];
      const last = name.split(',')[0];
      out.push({file,first,last,gender})
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
  async getGenders(names, prevNames){
    for (const n of names){
      if (!this.contains(prevNames,n)){
        console.log(n[0])
        const res = await (await fetch("https://api.genderize.io/?name="+"Albert".split(' ')[0])).json();
        debugger;

        console.log(res.json);
      }
    }
  }
  contains(list,el){
    return list.filter(x=>x.names===el).length;
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
      </div>
    )
  }
  getOutput(){
    return (
      <div>
        Output
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
