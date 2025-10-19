import React from 'react';
import Button from '../Button/Button';
import './SidebarPage.css'

const SidebarPage = ({buttons}) => {
  return (
    <>
        <div className="sidebar">
            {buttons.map((button)=>{
                return(<Button onClick={button.func} className="">
                    {button.text}
                </Button>)
            })}
            
        </div>
    </>
  )
}

export default SidebarPage;