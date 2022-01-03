import { ComponentPropsWithoutRef } from "react"

const ExtLink = (props: ComponentPropsWithoutRef<any>) => (
  <a {...props} rel="noopener" target={props.target || '_blank'} />
)
export default ExtLink
