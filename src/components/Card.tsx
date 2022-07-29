
import Image from 'next/image'
import Link from 'next/link'


export default ({children}: {children: React.ReactNode}) => {
    return (

        <div className="max-w-sm w-80 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            {children}
        </div>

    )
}

export const CardHeader = ({href='', imageSrc, imageAlt}:{href:string,imageSrc:string, imageAlt:string}) =>{
    return (
        <Link href={href}>
            <a className='aspect-h-1 flex justify-center p-0.5'>
                {/* {imageSrc ? <Image style={{}} className="rounded-t-lg" src={imageSrc} alt={imageAlt} layout='fixed' height={360} width={370} objectFit={'contain'}/> :  */}
                {imageSrc ? <img 
                style={{height:360, width:370, objectFit:'contain'}} 
                // loading="lazy" 
                className="rounded-t-lg" src={imageSrc} alt={imageAlt} onError={()=>console.log('imagefailed')}
                // decoding="async"
                sizes="(max-width: 370px)"
                /> : 
                <div style={{height:360, width:370}} className='bg-lime-700'/>}
            </a>
        </Link>
    )
}

export const CardFooter = ({name, description, children}:{name:string,description:string, children?:React.ReactNode}) =>{
    return (
        <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>
            {/* <a className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Read more
                <svg aria-hidden="true" className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a> */}
            {children}
        </div>
    )
}