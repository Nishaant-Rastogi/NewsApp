import React, { Component } from 'react'

export class NewsItem extends Component {
    render() {
        let {title, description, imageURL, newsURL, author, date, source} = this.props;
        return (
            <div>
                <div className="card">
                    <img src={imageURL} className="card-img-top" alt="..."/>
                    <span className="position-absolute translate-middle badge rounded-pill badge-success" style={{top:'-2%',zIndex:'1'}}>{source}</span>
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{description}</p>
                        <a rel="noreferrer" href={newsURL} target="_blank" className="btn btn-dark">Read More</a>
                    </div>
                    <div className="card-footer">
                            <small className="text-muted">By {author? author:"Unknown"} on {new Date(date).toGMTString()}</small>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsItem
