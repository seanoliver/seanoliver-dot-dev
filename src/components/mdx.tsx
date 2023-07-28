import './mdx.css';
import type { MDXComponents } from 'mdx/types';
import { UnderLink } from '@/components/under-link';
import CodeBlock from '@/components/code-block';

// TODO: Fix Type Errors

export const mdxComponents: MDXComponents = {
	p: props => (
		<p
			{...props}
			className='leading-7 [&:not(:first-child)]:mt-6'
		/>
	),
	h1: props => (
		<h1
			{...props}
			className='text-3xl leading-9 mb-4'
		/>
	),
	h2: props => (
		<h2
			{...props}
			className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mt-16'
		/>
	),
	h3: props => (
		<h3
			{...props}
			className='scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 mt-16'
		/>
	),
	h4: props => (
		<h4
			{...props}
			className='scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 mt-16'
		/>
	),
	h5: props => (
		<h5
			{...props}
			className='text-md leading-5 mb-4 first:mt-0 mt-16'
		/>
	),
	h6: props => (
		<h6
			{...props}
			className='text-sm leading-4 mb-4 first:mt-0 mt-16'
		/>
	),
	ul: props => (
		<ul
			{...props}
			className='my-6 ml-6 list-disc [&>li]:mt-2'
		/>
	),
	ol: props => (
		<ol
			{...props}
			className='list-decimal pl-6 mb-6'
		/>
	),
	li: props => (
		<li
			{...props}
			className='mb-2 text-sm'
		/>
	),
	a: props => (
		<UnderLink
			target='_blank'
			{...props}
		/>
	),
	blockquote: props => (
		<blockquote
			{...props}
			className='mt-6 border-l-2 pl-6 italic'
		/>
	),
	hr: props => (
		<hr
			{...props}
			className='border-gray-300 my-6'
		/>
	),
	table: props => (
		<table
			{...props}
			className='table-auto w-full'
		/>
	),
	th: props => (
		<th
			{...props}
			className='border border-gray-300 px-4 py-2'
		/>
	),
	td: props => (
		<td
			{...props}
			className='border border-gray-300 px-4 py-2'
		/>
	),
	pre: props => (
		<CodeBlock
			code={props.children}
			language={props['data-language']}
			{...props}
		/>
	),
	code: props => (
		<code
			{...props}
			className={
				!props['data-theme'] &&
				'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold'
			}
		/>
	),
	img: props => (
		<img
			{...props}
			className='mx-auto'
		/>
	),
};
