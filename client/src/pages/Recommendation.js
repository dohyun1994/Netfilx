import React from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'

import { Movie, Menu, Button } from 'components'
import './Recommendation.css'

const Recommendation = () => {
    const location = useLocation()
    const { movies } = location.state
    console.log(movies)
    const navigate = useNavigate()

    const likes = JSON.parse(sessionStorage.getItem('likes')) || {}
    console.log(likes)

    const toHomePage = () => {
        navigate('/home')
    }

    const bestMovies = movies
                            .sort( (a, b) => {
                                return (b.rating - a.rating);
                            })
                            .slice(0, 3)
                            .map(movie =>
                                <Link key={movie.id}  
                                    to='/detail'
                                    state={{ movie }} 
                                    style={{ textDecoration: 'none', color: 'white'}}
                                >
                                    <Movie 
                                            title={movie.title} 
                                            genres={movie.genres} 
                                            cover={movie.medium_cover_image} 
                                            summary={movie.summary}
                                            year={movie.year}
                                            rating={movie.rating}
                                            likes={likes[movie.id]}
                                        />
                                </Link> 
                                        )
    
    // likes 객체를 배열 객체로 변환하기
    const likesArray = []
    for(let like in likes){
        likesArray.push({ id: like, favorite: likes[like]})
    }

    // favorite (좋아요 숫자) 기준으로 정렬하기
    const bestMoviesByLikes = likesArray
    .sort( (a, b) => {
        return (b.favorite - a.favorite);
    })
    .slice(0, 3)
    .map(likeInfo => {
        const movieId = parseInt(likeInfo.id) 
        const movie = movies.filter(movie => movie.id === movieId)[0]
        console.log('movie by likes',parseInt(likeInfo.id))
        console.log('movie: ', movie)

        return (
            <Link key={movie.id}  
            to='/detail'
            state={{ movie }} 
            style={{ textDecoration: 'none', color: 'white'}}
        >
            <Movie 
                    title={movie.title} 
                    genres={movie.genres} 
                    cover={movie.medium_cover_image} 
                    summary={movie.summary}
                    year={movie.year}
                    rating={movie.rating}
                    likes={likes[movie.id]}
                />
        </Link> 
        )     
     } )
                


    return (
        <div className='Recommendation-container'>
            <Menu>
                <Button handleClick={toHomePage}>Home</Button>
            </Menu>
            <div className='Recommendation-text first-text'>Best Movies by rating</div>
            <div className='Recommendation-bestmovies'>{bestMovies}</div>
            <div className='Recommendation-text second-text'>Best Movies by likes</div>
            <div className='Recommendation-bestmovies'>{bestMoviesByLikes}</div>
        </div>
    )
}
export default Recommendation