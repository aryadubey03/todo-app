import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus,FaTimes } from 'react-icons/fa';

function Todolist({ value,onRemoveList }) {
    const [hover,setHover]=useState(false);
    return (
        <div className="lists" onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            ✒️
            <Link  className="link" to={`/list/${value}`}>
                {value}
            </Link>
            <div className="listcross">
            <FaTimes 
              style={{ color: hover ? 'gray' : '#eaecba', cursor: 'pointer' }}
            onClick={onRemoveList}/>
            </div>
        </div>
    );
}
function Sidebar() {
    const [newlist, changelist] = useState([]);
    const [newValue, changeValue] = useState("");
    const [setVisibility, changeVisibility] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const [refresh,setrefresh]=useState(false);
    useEffect(() => {
        fetch('http://localhost:5000/getlists')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length!=0) {
                    changelist(data);
                    navigate(`/list/${data[0]}`)
                }
                else {
                    changelist([]);
                    navigate('/');
                }
            })
    }, [refresh])

    const onRemoveList=({value})=>{
        fetch('http://localhost:5000/removelist', {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listname: value})
        })
            .then(res => res.text())
            .then(data => {
                console.log(data)
                setrefresh(prev=>!prev);
            })
    }
    const onChangeValue = (e) => {
        changeValue(e.target.value);
    }

    const onPressEnter = (e) => {
        console.log(e.key);
        if (e.key === "Enter") {
            if (newValue == "") {
                alert("Enter proper list name")
                return
            }
            fetch('http://localhost:5000/addlist', {
                method: 'Post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listname: newValue })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data.listname);
                    changelist([...newlist, data.listname]);
                    changeValue("");
                    navigate(`/list/${data.listname}`);
                })
            //changelist([...newlist,newValue]);
            //console.log(newValue);
            //changeValue("");
        }
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                changeVisibility(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, []);

    const onAdd = () => {
        changeVisibility(true);
    }
    return (
        <div className="sidebar">
            <div className="inputsidebar" ref={inputRef}>
                <button className="addlist" onClick={onAdd}><FaPlus /></button>
                <input style={{ display: setVisibility ? 'inline' : 'none' }}
                    onChange={onChangeValue}
                    value={newValue}
                    onKeyDown={onPressEnter}></input>
                <div style={{ display: setVisibility ? 'none' : 'inline' }}>NEW LIST</div>
            </div>
            <div className="sidebarlists">
            {newlist.map((value,index) => (
                <Todolist 
                index={index} 
                value={value} 
                onRemoveList={()=>onRemoveList({value})}/>
            ))}
            </div>
            <div className="homepagelink"><Link id="homepage"to={`/`}>
                🏠 Homepage
            </Link></div>
        </div>
    );
}

export default Sidebar;