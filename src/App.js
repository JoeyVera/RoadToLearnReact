import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

class App extends Component {

  constructor(props){
    super(props);

    this.state ={
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss=this.onDismiss.bind(this);
    this.onSearchChange=this.onSearchChange.bind(this);
    this.onSearchSumit = this.onSearchSumit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  setSearchTopStories(result){
    this.setState({result});
  }

  fetchSearchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  componentDidMount(){
    const {searchTerm}  = this.state;
    this.fetchSearchTopStories(searchTerm);
  }


  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: {...this.state.result, hits: updatedHits}
    });
  }

  onSearchSumit(event){
    const{ searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  render(){
    const {searchTerm, result}=this.state;

    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSumit}
          >
            Search
          </Search>
        </div>
        { result
          ?  
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
          />
        : null
        }
      </div>
    );
  }
}

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}    
    </button>
  </form>

function Table({list, onDismiss}){
  return(
    <div className="table">
      {list.map(item =>
        <div key ={item.objectID} className="table-row">
          <span style={{ width: '40%' }}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ width: '30%' }}> 
            {item.author}
          </span>
          <span style={{ width: '10%' }}> 
            {item.num_comments}
          </span>
          <span style={{ width: '10%' }}> 
            {item.points} 
          </span>
          <span style={{ width: '10%' }}>
            <Button
              onClick={()=> onDismiss(item.objectID)} 
              className="button-inline"               
            >
              Dismiss
            </Button>
          </span>
        </div>
      )}
    </div>
  )
}


function Button({onClick, className, children}){
  return(
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  )
}



export default App;
