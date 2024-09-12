import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import left from "./img/left.svg"
import right from "./img/right.svg"
function App() {
  const [avatars, setAvatars] = useState([])
  const [offset, setOffset] = useState(5)
  const [isDisabled, setIsDisabled] = useState(false);
  const [character,setcharacter] = useState({})
  const [selectedIndex, setSelectedIndex] = useState(null);
  function generarStringAleatorio(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    const caracteresLength = caracteres.length;
    
    for (let i = 0; i < longitud; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteresLength);
      resultado += caracteres.charAt(indiceAleatorio);
    }
    
    return resultado;
  }
  const  TraerAvatars = async (seed)=>{
    const response  = await fetch("https://api.dicebear.com/9.x/pixel-art/svg?seed="+seed)
    const svgText = await response.text();
    setAvatars([...avatars,svgText])
  }
  const arrowLeft = ()=> {
    if(offset >5) {
      setOffset(offset-1)
    }
  }
  const setCharacter = (e)=> {
    console.log(e)
  }
  const arrowRight = ()=> {
    setIsDisabled(true);
    const timeoutDuration = 300;
    setTimeout(() => {
      setIsDisabled(false);
  }, timeoutDuration);
    setOffset(offset+1)
    console.log(offset)
    console.log(avatars.slice(offset-5,offset))
    TraerAvatars(generarStringAleatorio(4))
  }
  useEffect(()=> {
    const fetchAvatar = async () => {
      try {
        const response = await fetch("https://api.dicebear.com/9.x/pixel-art/svg?seed=" + generarStringAleatorio(4));
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.text();
      } catch (error) {
        console.error('Error al obtener el avatar:', error);
        return ''; // Retornar una cadena vacía en caso de error
      }
    };
    const fetchAvatars = async () => {
      try {
        const avatarPromises = Array.from({ length: 7 }, () => fetchAvatar());
        const avatarSvgs = await Promise.all(avatarPromises);
        setAvatars(avatarSvgs);
      } catch (error) {
        console.error('Error al obtener los avatares:', error);
      }
    };

    fetchAvatars();
  },[])
  
  console.log(typeof(avatars));
  return (
    <section className='Inicio'>
      <h1>TwiRandom</h1>
      <div className='avatarChoose'>
        <button className='arrow' onClick={arrowLeft}>
          <img src={left} alt="Left Arrow" />
        </button>
        {avatars.slice(offset - 5, offset).map((svg, index) => (
          <div
            key={index}
            className={`character${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => setSelectedIndex(index)}
          >
            <div className='svg' dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
        ))}
        <button disabled={isDisabled} className='arrow' onClick={arrowRight}>
          <img src={right} alt="Right Arrow" />
        </button>
      </div>
    </section>
  );
}

export default App;
