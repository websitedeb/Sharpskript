#!/usr/bin/env node

import { Text, Box } from "ink";

export function UI({ content, error }: { content: string; error?: boolean }) {
	return (
		<Box flexDirection="column">
			<Text color={error ? "red" : "green"}>{content}</Text>
		</Box>
	);
}