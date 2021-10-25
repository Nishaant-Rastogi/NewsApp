import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'

export default class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 6,
        category: 'general'
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
            loading : false,
            totalResults: 0,
            page : 1
        }
        document.title = `NewsJunkey-${this.props.category.toUpperCase()}`;
    }
    async updateNews(pageNo){
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=fa9925286f9e40038a5401ddf8621ef0&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
        let data = await fetch(url);
        let parsedData = await data.json()

        this.setState({articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false})
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
    render() {
        return (
            <div className="container my-3">
                <h1 className="text-center">NewsJunkey - Top {this.props.category !== 'general'?this.props.category.toUpperCase():""} Headlines</h1>
                {this.state.loading && <Spinner/>}
                <div className="row">
                    {!this.state.loading && this.state.articles.map((element)=>{
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
                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                    <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </div>
        )
    }
}
