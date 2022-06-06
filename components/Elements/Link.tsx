import NextLink from 'next/link'

export default function Link({ ...props }) {
  return (
    <NextLink href={props.href} as={props.as}>
      <a className={props.className} onClick={props.onClick}>
        {props.children}
      </a>
    </NextLink>
  )
}
