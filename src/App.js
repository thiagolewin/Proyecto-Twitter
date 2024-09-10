import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [avatars, setAvatars] = useState([])
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
        const avatarPromises = Array.from({ length: 5 }, () => fetchAvatar());
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
        <div className='avatarChoose'> { avatars.map(svg=>(<div dangerouslySetInnerHTML={{ __html: svg }} />))}</div>
       
        
    </section>
  );
}

export default App;
