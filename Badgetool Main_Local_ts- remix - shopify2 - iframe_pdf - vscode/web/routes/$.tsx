import React from "react";
import { Page, Card, Text } from "@shopify/polaris";

export default function CatchAll() {
  return (
    <Page title="Page Not Found">
      <Card>
        <Text variant="headingMd" as="h2">
          404 - Page Not Found
        </Text>
        <Text variant="bodyMd" as="p">
          The page you're looking for doesn't exist.
        </Text>
      </Card>
    </Page>
  );
} 