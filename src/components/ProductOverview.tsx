import Link from 'next/link'
import Image from 'next/image'
import Ethereum from "../icons/Ethereum.png"
import { formatPrice } from '../utils/formating'
import { MetadataProduct } from '../types'

export default function ProductOverview({product} : {product:MetadataProduct}) {

  return (
    <div className="bg-white">
      <div className="pt-6 pb-16 sm:pb-24">
        <div className="mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* lg:grid-cols-12 lg:gap-x-8 */}
          <div className="lg:grid lg:auto-rows-max">
            <div className="lg:col-start-8 lg:col-span-5">
              <div className="flex justify-between">
                <Link href={''}>
                  <a className="text-xl font-medium text-gray-900">{product.collection}</a>
                </Link>
                {/* <h1 className="text-xl font-medium text-gray-900">{product.collection}</h1> */}
                
                {product.price? <p className="text-xl font-medium text-gray-900 flex flex-row items-center">
                  <Image src={Ethereum} width={20} height={22} />
                  {formatPrice(product.price)}
                </p> : null}
              </div>
              <h5 className="mb-5 mt-5 text-2xl font-bold tracking-tight text-gray-900">{product.name}</h5>
              {/* Reviews */}
              
            </div>

            {/* Image gallery */}
            <div className="mt-8 lg:mt-0 lg:col-start-1 lg:col-span-7 lg:row-start-1 lg:row-span-3 max-w-2xl">
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className={'max-h-[800px] lg:col-span-2 lg:row-span-2 rounded-lg'}
              />
            </div>

            <div className="mt-8 lg:col-span-5">
              
              <button
                type="submit"
                className="mt-8 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={product.onClickHandler}
              >
                {product.buttonText}
              </button>

              {/* Product details */}
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Description</h2>

                <div className="mt-4 prose prose-sm text-gray-500">
                  {product.description }
                </div>
              </div>

              {/* Attributes */}
              <section aria-labelledby="policies-heading" className="mt-10">
                <h2 className="text-sm font-medium text-gray-900 m-1 mb-4">Attributes</h2>

                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {product.attributes?.map((att) => (
                    <div key={att.trait_type} className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <dt>
                        {/* <policy.icon className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" /> */}
                        <span className="mt-4 text-sm font-medium text-gray-900">{att.trait_type}</span>
                      </dt>
                      <dd className="mt-1 text-sm text-gray-500">{att.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
