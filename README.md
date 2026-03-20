# IncoSerra(the name of the webapp and the platform)

Stabilizing gig income, one day at a time.

Updates made according to the URGENT: 24-HOUR DEADLINE MARKET SHIFT.

## Overview

IncoSerra is a simple prototype that explores how small, on-time payouts could help gig workers when a day starts going wrong because of things like weather or low demand.

## Problem

Gig work can be unpredictable. On some days, earnings drop quickly, and there isn’t always enough cushion to cover rent, food, and travel.

We see recurring issues like:

- Unpredictable daily earnings
- Low savings to handle short-term drops
- High living costs in cities
- No quick system to respond when conditions worsen for the day

Even a couple of tough days can make regular expenses harder to manage.

## Our Vision and Our Demo video
YouTube link :- https://youtu.be/9ho5SO3qdrM?si=7hwlHFDmW4cGoZFw

The idea is to move towards a system that can provide basic financial stability for gig workers during uncertain conditions.

## Research

Across reports and industry updates, a common picture keeps showing up:

- Many workers earn around ₹20,000–₹30,000 per month (varies by city and platform)
- Savings are often very low
- Work hours can be long (commonly around 10–12 hours a day)
- Earnings can swing a lot from day to day

That’s why even small disruptions can have an outsized impact.

## Our Idea and Motive

IncoSerra focuses on the situation a worker faces that day and decides whether a small payout could reduce the impact of a sudden income drop.

The goal isn’t to replace income. It’s to take the edge off the days that hit hardest, so workers can keep going.

## Core Logic

weather + demand + activity → payout

In simple terms:

- Weather captures external disruptions (for example, heavy rain)
- Demand reflects how likely orders are during that period
- Activity checks whether the worker was actually working/available that day

When the combination points to low earning potential and the worker is active, the system triggers a small payout.

## Adversarial Defense & Anti-Spoofing Strategy (this was the change that was made according to "URGENT: 24-HOUR DEADLINE MARKET SHIFT")

This part of the system is meant to reduce fake claims and location spoofing, without making life harder for genuine workers.

### 1. Differentiation

The system tries to tell a real worker from someone faking location by looking at behavior and consistency, not just GPS.

- Cross-check activity: use things like hours worked and recent task/activity signals to see if the day matches the location claim.
- Check consistency of movement: real movement usually looks continuous and believable over time, while spoofed location often jumps or repeats patterns.
- Look for mismatch: if the worker looks active in the app but the location signals don’t line up (or vice versa), that’s a red flag.

### 2. Data Points Used (here it is not only GPS but beyond GPS)

Beyond GPS location, the system can use simple signals that are harder to fake all at once:

- App activity time (when the app was actively used)
- Number of deliveries/orders completed or started
- Movement patterns (travel looks continuous; it is not only “teleporting” between places)
- Weather vs activity mismatch (for example, heavy-rain days where activity patterns don’t match what you’d expect)
- Repeated claims from the same area/group (unusual repeat patterns can indicate coordinated fraud)

When these signals are combined, it’s much harder for someone to spoof only one thing and still pass the checks.

### 3. UX Balance

If something looks suspicious, the goal is not instant rejection. The system should protect real workers while still preventing abuse:

- Temporary flag instead of rejection: keep payouts paused or limited only while the check runs.
- Reduced payout or delayed verification: if the system is unsure, it can hold back part of the payout until signals improve.
- Manual review or a quick re-check: review the specific case using the same signals, then decide.
- Benefit of doubt for consistent workers: if a worker’s history has been stable and the recent signals are only slightly off, treat them more gently.

## Tech Stack(this is only for phase 1 we will enhance more) 

- HTML
- CSS
- JavaScript

## Planned Integrations(But it could be more)

- Weather API (real-time conditions)
- Location data (to apply local conditions)
- Demand estimation (based on time and area patterns)

## References(we used for research purpose)

- https://www.livemint.com/
- https://trak.in/
- https://www.business-standard.com/
- https://www.outlookbusiness.com/
- https://www.ilo.org/


