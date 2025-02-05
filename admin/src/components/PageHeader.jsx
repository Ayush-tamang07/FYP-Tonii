import React from 'react'

export default function PageHeader({title}) {
  return (
    <header className='rounded-xl'>
        <h1 className='text-4xl ml-6 font-semibold'>{title}</h1>
    </header>
  )
}
