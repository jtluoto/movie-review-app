import React from 'react'

const Synopsis = ({movie}) => {
  var synopsis = movie.shortSynopsis

  if (synopsis) {
    var paragraphs = synopsis.split('\r\n')
    var paragraphElements = paragraphs.map((p, i) => {
      return (<p key={`synopsis_paragraph_${i}`}>{p}</p>)
    })

    return (
      <div className='movieSynopsis'>{ paragraphElements }</div>
    )
  } else {
    return null
  }
}

export default Synopsis
