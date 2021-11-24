import React,{ useEffect, useState, useRef } from "react";
import Data from "./SampleData/Data";
import Tags from "./SampleData/Tags";
import CardUI from "./CardUI";
import axios from "axios";
import "./Home.css";
const limit = 10;


const Home = () => {
    const [Data, setData] = useState([]);
    const [offset, setoffset] = useState(0);
    const [isLoading, setisLoading] = useState(true);
    const [isError, setisError] = useState(false);

    useEffect(() => {
        axios({
            method: "GET",
            url: `https://iic-blog-backend.herokuapp.com/home/articles?limit=${limit}&offset=${offset}`
        }).then(req => {
            setData(req.data);
            setisLoading(false);
        }).catch(err => setisError(true));
    },[]);
    
    const NextUpdate = () => {
        setisLoading(true);
        axios({
            method: "GET",
            url: `https://iic-blog-backend.herokuapp.com/home/articles?limit=${limit}&offset=${offset+limit}`
        }).then(req => {
            setData([...req.data]);
            setoffset(offset + limit);
            setisLoading(false);
        }).catch(err => setisError(true));
    };

    const PrevUpdate = () => {
        if(offset===0)return;
        setisLoading(true);
        axios({
            method: "GET",
            url: `https://iic-blog-backend.herokuapp.com/home/articles?limit=${limit}&offset=${offset-limit}`
        }).then(req => {
            setData([...req.data]);
            setoffset(offset - limit);
            setisLoading(false);
        }).catch(err => setisError(true));
    };

    return (
        <>
            { isLoading ? "Loading" : <PageMain Data={Data}/> }
            { isLoading ? null : 
                <div className="pageControl">
                    <button onClick={PrevUpdate}>prev</button>
                    <h4>{(offset/limit)+1}</h4>
                    <button onClick={NextUpdate}>next</button>
                </div>
            }
        </>
    );
};

const PageMain = (props) => {
    return (
        <div className="HomePage_Main">
            <div className="HomePage_CardHolder">
                {props.Data.map((e,index) => {
                    return <CardUI key={index} {...e}/>
                })}
            </div>
            <div className="HomePage_TagHolder">
                <div className="HomePage_TagHead">TAGS</div>
                <div className="HomePage_RecomendedTags">
                    {Tags.map((e,index) => {
                        return <div key={index} className="HomePage_Tags">{e}</div>
                    })}
                </div>
            </div>
        </div>
    );
};

export default Home;