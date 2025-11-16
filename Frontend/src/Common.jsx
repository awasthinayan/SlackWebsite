import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Common = (props) => {

    const currentPath = useLocation().pathname

    const pageRef = useRef(null)
 const stairparentref = useRef(null)

  useGSAP(function(){
      const tl = gsap.timeline();

      tl.to(stairparentref.current,{
      display:'block',
    })
    tl.from('.stairs',{
      height:0,
      stagger:{
        amount:-0.2,
      }
    })
    tl.to('.stairs',{
      y:'100%',
      stagger:{
        amount:-0.2, 
      }
    })
    tl.to(stairparentref.current,{
      display:'none',
    })
    tl.to('.stairs',{
      y:'0%',
    })

  gsap.from(pageRef.current,{
            opacity:0,
            delay:1.3,
            scale:1.2
        })
    }, [currentPath])
  return (
   <div>
      <div ref= {stairparentref} className='h-screen w-full fixed z-20 top-0'>
       <div className='h-full w-full flex'>
        <div className='stairs h-full w-1/5 bg-black'></div>
        <div className='stairs h-full w-1/5 bg-black'></div>
        <div className='stairs h-full w-1/5 bg-black'></div>
        <div className='stairs h-full w-1/5 bg-black'></div>
        <div className='stairs h-full w-1/5 bg-black'></div>
        <div className='stairs h-full w-1/5 bg-black'></div>
      </div>
     </div>
     <div ref={pageRef}>
        {props.children}
     </div>
   </div>
  )
}
export default Common