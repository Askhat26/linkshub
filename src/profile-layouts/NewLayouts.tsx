import React from "react";
import type { ProfileLayoutProps } from "./new/common";

import CreatorHeroLayout from "./new/CreatorHero";
import FeaturedSpotlightLayout from "./new/FeaturedSpotlight";
import SocialGridLayout from "./new/SocialGrid";
import CreatorCardStackLayout from "./new/CreatorCardStack";
import MediaCreatorLayout from "./new/MediaCreator";
import StoryTimelineLayout from "./new/StoryTimeline";
import BusinessCardLayout from "./new/BusinessCard";
import ProductShowcaseLayout from "./new/ProductShowcase";
import NeonGamingLayout from "./new/NeonGaming";
import MinimalPortfolioLayout from "./new/MinimalPortfolio";

/**
 * Dynamic template registry (scalable):
 * Add new templates here without touching pages.
 */
export const NEW_LAYOUTS: Record<string, (p: ProfileLayoutProps) => React.ReactNode> = {
  "creator-hero": (p) => <CreatorHeroLayout {...p} />,
  "featured-spotlight": (p) => <FeaturedSpotlightLayout {...p} />,
  "social-grid": (p) => <SocialGridLayout {...p} />,
  "creator-card-stack": (p) => <CreatorCardStackLayout {...p} />,
  "media-creator": (p) => <MediaCreatorLayout {...p} />,
  "story-timeline": (p) => <StoryTimelineLayout {...p} />,
  "business-card-layout": (p) => <BusinessCardLayout {...p} />,
  "product-showcase": (p) => <ProductShowcaseLayout {...p} />,
  "neon-gaming": (p) => <NeonGamingLayout {...p} />,
  "minimal-portfolio": (p) => <MinimalPortfolioLayout {...p} />,
};

export function isNewLayout(layoutId?: string) {
  return !!layoutId && Object.prototype.hasOwnProperty.call(NEW_LAYOUTS, layoutId);
}

export function RenderNewLayout(props: ProfileLayoutProps) {
  const layout = props.appearance.layout;
  const renderer = NEW_LAYOUTS[layout];
  return renderer ? renderer(props) : null;
}