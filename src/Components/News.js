import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export default class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 6,
        category: 'general',
        totalResults: 0
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }
    constructor(props){
        super(props);
        this.state = {
            articles : [],
            loading : true,
            totalResults: 0,
            page : 1
        }
        document.title = `NewsJunkey-${this.props.category.toUpperCase()}`;
    }
    async updateNews(pageNo){
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
        this.props.setProgress(30);
        let data = await fetch(url);
        this.props.setProgress(70);
        let parsedData = await data.json()

        this.setState({articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false})
        this.props.setProgress(100);
    }
    async componentDidMount(){
        this.updateNews();
    }
    handleNextClick = async() =>{
        this.setState({page: this.state.page+1});
        this.updateNews()
    }
    handlePrevClick = async () =>{
        this.setState({page: this.state.page-1});
        this.updateNews()
    }
    fetchMoreData = async () => {
        this.setState({page: this.state.page + 1})
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json()

        this.setState({articles: this.state.articles.concat(parsedData.articles), totalResults: parsedData.totalResults, loading: false})
    }
    render() {
        return (
            <div className="container my-3">
                <h1 className="text-center">NewsJunkey - Top {this.props.category !== 'general'?this.props.category.toUpperCase():""} Headlines</h1>
                <InfiniteScroll dataLength={this.state.articles.length}
                                next={this.fetchMoreData}
                                hasMore={this.state.articles.length !== this.state.totalResults}
                                loader={<Spinner/>}>
                    <div className="container">
                        <div className="row">
                            {this.state.articles.map((element)=>{
                                return  <div className="col-md-4 my-3"  key={element.url}>
                                            <NewsItem title={!element.title?"":element.title.slice(0,50)} 
                                            description={!element.description?"":element.description.slice(0,90)} 
                                            imageURL={element.urlToImage} 
                                            newsURL={element.url}
                                            author={element.author}
                                            date={element.publishedAt}
                                            source={element.source.name}/>
                                        </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
                {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                    <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div> */}
            </div>
        )
    }
}
