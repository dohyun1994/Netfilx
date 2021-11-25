import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Movie, Loading, Input, Button, Menu } from 'components'
import './Home.css'

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [movies, setMovies] = useState([])
    const [query, setQuery] = useState('')
    const [isSorted, setIsSorted] = useState(-1)
    const navigate = useNavigate()

    // 세션스토리지에서 좋아요 정보를 조회하기
    const likes = JSON.parse(sessionStorage.getItem('likes')) || {}
    console.log(likes)
    

    useEffect( () => {
        fetch('https://yts.mx/api/v2/list_movies.json?limit=20')
        .then( res => res.json())
        .then( result => {
            const {data: {movies}} = result
            console.log(movies)
            setLoading(false)
            setMovies(movies)
        })
    }, [])

    const handleChange = (e) => {
        const { value } = e.target
        setQuery(value)
    }

    const sortByYear = (e) => {
        setIsSorted(isSorted * -1)
    }

    // 사용자가 클릭한 해당 영화에 대한 좋아요 숫자 업데이트하기
    const updateLikes = (id) => {
        const likes = JSON.parse(sessionStorage.getItem('likes')) || {}
       
        if(likes[id] === null || likes[id] === undefined){
            likes[id] = 0
        }
        likes[id] += 1
        sessionStorage.setItem('likes', JSON.stringify(likes))
    }

    const homeUI = movies
                        // 검색
                        .filter(movie => {
                            const title = movie.title.toLowerCase()
                            const genres = movie.genres.join(' ').toLowerCase()
                            const q = query.toLowerCase()
                        
                            return title.includes(q) || genres.includes(q)
                        })

                        // 정렬
                        .sort( (a, b) => {
                            return (b.year - a.year) * isSorted;
                        })

                        // 조회
                        .map(movie =>
                            <Link key={movie.id}  
                                  to='/detail'
                                  state={{ movie }} 
                                  style={{ textDecoration: 'none', color: 'white'}}
                                  onClick={() => updateLikes(movie.id)}
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

    const toRankPage = () => {
        navigate('/recommend', { state: { movies }})
    }
    return (
        <>
            {loading? <Loading/>: <div className='Home-container'>
                                    <Menu>
                                        <Button handleClick={toRankPage}>Rank</Button>
                                    </Menu>
                                    <div className='Home-contents'>
                                        <Input name='search' type='text' placeholder='Search movies ...' value={query} onChange={handleChange}/>
                                        <Button handleClick={sortByYear}>정렬</Button>
                                        <div className='Home-movies'>{homeUI}</div>
                                    </div>
                                  </div>}
        </>
    )
}

export default Home