import React from "react"
import { Input } from "semantic-ui-react"

const Example = () => {
  return (
    <Input
      icon={{ name: "search", circular: true, link: true }}
      placeholder='Search...'
    />
  )
}

export default Example
