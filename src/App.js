import { useState , useEffect} from "react"
import services from "./services/blog"

const UpdateLikeZone = ({blogId , updateHandler}) => {
  const [updateLikeField , setUpdateLikeField] = useState(false)
  const [newLikes , setLikes] = useState("")

  const likeChangeHandler = (e) => setLikes(e.target.value)

  const updateFunction = (blogId , newLikes) => {
    setUpdateLikeField(false)
    updateHandler(blogId , newLikes)
  }

  if(!updateLikeField)
  return(
    <>
      <button onClick={() => setUpdateLikeField(true)}>update likes</button>
    </>
  )
  else
  return(
    <>
      <input type="number" value={newLikes} onChange={likeChangeHandler}></input>
      <button type="submit" onClick={() => updateFunction(blogId , newLikes)}>submit</button>
    </>
  )
}

const ViewContent = ({ item , updateHandler , deleteHandler}) => {
  //const blog = props.item
  
  return(
    <>
      <h2>
        {item.title} 
        {item.author} 
        {item.url} 
        {item.likes} 
        <button onClick={() => deleteHandler(item.id)}>delete</button>
        <UpdateLikeZone blogId={item.id} updateHandler={updateHandler}/>
      </h2>
    </>
  )
}


const InputArea = (props) => {
  
  return(
    <>
      <h1>Input your piece ...</h1>
      <form onSubmit={props.submitHandler}>
        <input type="text" value={props.title} onChange={props.titleHandler} placeholder="Type the title..."/><br />
        <input type="text" value={props.author} onChange={props.authorHandler} placeholder="Type the author..."/><br />
        <input type="text" value={props.url} onChange={props.urlHandler} placeholder="Type the url..."/><br />
        <input type="number" value={props.likes} onChange={props.numberHandler} placeholder="Type the number of likes..."/><br />
        <button type="submit">submit</button>
      </form>
    </>
  )
}


const ViewArea = (props) => {
  
  const blogArray = props.content
  const updateHandler = props.updateHandler
  const deleteHandler = props.deleteHandler
  
  return(
    <>
      {blogArray.map(item => {
        return <ViewContent item={item} key={item.id} updateHandler={updateHandler} deleteHandler={deleteHandler}/>
      })}
    </>
  )
}

const App = () => {
  
  const [blogObject , setBlogObject] = useState([])
  const [title , setTitle] = useState("")
  const [author , setAuthor] = useState("")
  const [url , setUrl] = useState("")
  const [likes , setLikes] = useState('')
  
  const titleHandler = (e) => setTitle(e.target.value)
  const authorHandler = (e) => setAuthor(e.target.value)
  const urlHandler = (e) => setUrl(e.target.value)
  const numberHandler = (e) => setLikes(e.target.value)
  
  
  useEffect(() => {
    async function fetchData(){
      let blogs = await services.getAll()
      setBlogObject(blogs)
    }
    fetchData()
  },[])

  /*useEffect(() => {           //Promise based
    services.getAll()
    .then(responseData => {
      setBlogObject(responseData)
    })
  },[])*/
  
  
  const submitHandler = async (e) => {
    e.preventDefault()
    const newBlog = {
      title : title,
      author : author,
      url : url,
      likes : likes
    }
    
    const postRequest = await services.create(newBlog)
    setBlogObject(blogObject.concat(postRequest))   

    /*services.create(newBlog)           //promise based
    .then(responseData => {
      setBlogObject(blogObject.concat(responseData))
    })*/
    
    setTitle("")
    setAuthor("")
    setUrl("")
    setLikes('')
  }

  const updateHandler = async (id , likes) => {
    const blog = blogObject.find(blog => blog.id === id)
    const changedBlog = {...blog , likes : likes}

    const putRequest = await services.update(`${id}` , changedBlog)
    setBlogObject(blogObject.map(blog => blog.id !== id ? blog : putRequest))

    /*services                         //promise based
      .update(`${id}` , changedBlog)
      .then(responseData => {
        setBlogObject(blogObject.map(blog => blog.id !== id ? blog : responseData))
      })
      .catch(err => {
        console.log(err)
      })*/
  }
  
  const deleteHandler = (id) => {

    /*await services.remove(id)
    let remainingBlogs = blogObject.filter(blog => blog.id !== id)
    setBlogObject(remainingBlogs)*/

    services                  //promise based
      .remove(id)
      .then(responseData => {
        let remainingBlogs = blogObject.filter(blog => blog.id !== id)
        setBlogObject(remainingBlogs)
      })
  }

  return (
    <>
      <InputArea content={blogObject}
                 submitHandler={submitHandler} 
                 titleHandler={titleHandler} 
                 authorHandler={authorHandler} 
                 urlHandler={urlHandler} 
                 numberHandler={numberHandler} 
                 title={title}
                 author={author}
                 url={url}
                 likes={likes}
                />
      <ViewArea content={blogObject} updateHandler={updateHandler} deleteHandler={deleteHandler}/>
    </>
  )

}

export default App