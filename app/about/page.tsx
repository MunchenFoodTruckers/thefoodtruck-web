'use client';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ paddingBottom: '3rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Our Story</h1>
        <p style={{ maxWidth: '700px', margin: '0 auto' }}>
          From a passion for authentic street food to München's most loved food truck service
        </p>
      </section>

      {/* Main Content */}
      <div className="container">
        {/* Who We Are */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>
                🚚
              </div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                marginBottom: '1.5rem',
                letterSpacing: '-1px'
              }}>
                Who We Are
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'var(--gray-700)',
                marginBottom: '1rem'
              }}>
                München Food Truckers started in 2020 when three friends—a chef, a nutritionist, and a food enthusiast—came together with a shared vision: to bring authentic, high-quality street food to the people of München.
              </p>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'var(--gray-700)'
              }}>
                What began as a single food truck at Marienplatz has grown into a fleet of mobile kitchens serving thousands of happy customers across the city. We're proud to be München's #1 rated food truck service in 2024.
              </p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              borderRadius: '24px',
              padding: '3rem',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(6, 193, 103, 0.2)'
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>
                #1 Rated
              </h3>
              <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
                München's top food truck service with over 50,000 satisfied customers
              </p>
            </div>
          </div>
        </div>

        {/* Our Motivation */}
        <div style={{
          background: 'linear-gradient(180deg, #f7fafc 0%, #ffffff 100%)',
          borderRadius: '32px',
          padding: '4rem 3rem',
          marginBottom: '5rem',
          border: '1px solid rgba(0,0,0,0.06)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💡</div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: '1.5rem',
              letterSpacing: '-1px'
            }}>
              Our Motivation
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                Fresh & Local
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>
                We believe in supporting local farmers and using only the freshest, seasonal ingredients sourced from München and surrounding regions.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                Community First
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>
                We're not just a business—we're part of the München community. Every meal we serve strengthens the bonds that make our city special.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                Sustainability
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>
                From eco-friendly packaging to zero-waste kitchens, we're committed to protecting the planet for future generations.
              </p>
            </div>
          </div>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.8,
            color: 'var(--gray-700)',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            We saw too many people settling for unhealthy fast food or expensive restaurant meals. We knew there had to be a better way—food that's both nutritious and delicious, without breaking the bank.
          </p>
        </div>

        {/* Our Motto */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '2rem',
            letterSpacing: '-1px'
          }}>
            Our Motto
          </h2>

          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            borderRadius: '32px',
            padding: '4rem 3rem',
            color: 'white',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: '0 20px 60px rgba(6, 193, 103, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              fontSize: '15rem',
              opacity: 0.1
            }}>
              ❤️
            </div>

            <h3 style={{
              fontSize: '3rem',
              fontWeight: 800,
              marginBottom: '2rem',
              letterSpacing: '-1.5px',
              color: 'white',
              position: 'relative',
              zIndex: 1
            }}>
              Healthy. Tasty. Affordable.
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginTop: '3rem',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥗</div>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>
                  Healthy
                </h4>
                <p style={{ opacity: 0.95, fontSize: '1rem' }}>
                  Nutritionist-approved recipes with balanced macros and fresh ingredients
                </p>
              </div>

              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>😋</div>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>
                  Tasty
                </h4>
                <p style={{ opacity: 0.95, fontSize: '1rem' }}>
                  Chef-crafted flavors that make healthy eating a joy, not a chore
                </p>
              </div>

              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>
                  Affordable
                </h4>
                <p style={{ opacity: 0.95, fontSize: '1rem' }}>
                  Premium quality at prices everyone can enjoy, every day
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f7fafc 100%)',
          borderRadius: '32px',
          padding: '4rem 3rem',
          textAlign: 'center',
          border: '1px solid rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            letterSpacing: '-1px'
          }}>
            Join Our Journey
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--gray-600)',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem'
          }}>
            Every meal you order supports our mission to make healthy, delicious food accessible to everyone in München.
          </p>
          <a
            href="/menu"
            className="btn-primary"
            style={{
              fontSize: '1.1rem',
              padding: '1.25rem 3rem',
              borderRadius: '16px'
            }}
          >
            Explore Our Menu
          </a>
        </div>
      </div>
    </>
  );
}
