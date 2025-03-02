import React from 'react'
import x from './profile.module.css'

const Buttonmessage = () => {
    return (
        <div>
          <button style={{backgroundColor:'#ccc', color:"black"}} className={x.button}>
            Message
          </button>
        </div>
      )
}

export default Buttonmessage
