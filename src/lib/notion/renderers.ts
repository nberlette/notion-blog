import React, { createElement } from 'react';
import components from '@components/dynamic'

function applyTags (tags = [], children: any, noPTag = false, key: any) {
  let child = children

  for (const tag of tags) {
    const props: Record<string, any> = { key }
    let tagName = tag[0]

    switch (tagName) {
      case 'p':
        if (noPTag) tagName = React.Fragment;
        break;
      case 'c':
        tagName = 'code';
        break;
      case '_':
        tagName = 'span';
        props.className = 'underline';
        break;
      case 'a':
        props.href = tag[1];
        break;
      case 'e':
        tagName = components.Equation;
        props.displayMode = false;
        child = tag[1];
        break;
    }

    child = createElement(components[tagName] || tagName, props, child)
  }
  return child
}

export function textBlock (text = [], noPTag = false, mainKey?: any) {
  let children = []
    , i = 0;

  for (const textItem of text) {
    if (textItem.length === 1) {
      children.push(textItem)
      continue
    }
    children.push(applyTags(textItem[1], textItem[0], noPTag, i))
    i++;
  }
  return createElement(
    (noPTag ? React.Fragment : components.p),
    { key: mainKey },
    ...children,
    noPTag
  );
}
