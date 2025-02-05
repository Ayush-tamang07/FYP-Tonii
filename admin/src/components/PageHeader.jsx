import React from 'react'

export default function PageHeader({title}) {
  return (
    <header className='bg-white p-6 rounded-xl'>
        <h1 className='text-2xl'>{title}</h1>
    </header>
  )
}
