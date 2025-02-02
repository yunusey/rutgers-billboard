# Rutgers Billboard
## About

_A platform for facilitating section trades among students._

When I first joined Rutgers about 5–6 months ago, I noticed that by the time I could register, the best sections were already full. This made me wonder if there was a way to optimize student satisfaction by considering their preferred sections.

While an algorithmic solution is feasible, potential fraud and the inability to hold students accountable without storing their personal information present challenges. As an alternative, this platform allows users to post "billboards" listing the sections they have and the ones they seek. Other students can then browse these listings and, if a match is found, arrange a section swap.

In the future, the platform could evolve to detect cyclical exchanges involving more than two students, further improving the efficiency of section trades and benefiting the Rutgers student community.

## Features
- **High-performance database** powered by [MongoDB](https://www.mongodb.com/) for fast and efficient data handling.
- **Secure authentication** using [Auth0](https://auth0.com/) to ensure user privacy and account safety.
- **Real-time course data** dynamically retrieved from Rutgers' public APIs.
- **Advanced filtering** to easily search for available sections by course and section preferences.
