import React, { Fragment } from 'react'

import Home from "@/components/ui/home/Home"

import Services from "@/components/ui/services/Services"

import Annount from "@/components/ui/annount/Annount"

export default function page() {
  return (
    <Fragment>
      <Home />
      <Services />
      <Annount />
    </Fragment>
  )
}
