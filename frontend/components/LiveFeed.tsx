"use client";

import useLiveFeed from "@/hooks/useLiveFeed";

export default function LiveFeed() {

  const posts = useLiveFeed();
  const uniquePosts = Array.from(
  new Map(
    posts.map(post => [
      post.text,
      post
    ])
  ).values()
);


  return (

    <div className="space-y-5">

      {
        posts.length === 0 ? (

          <p className="text-gray-400">
            Loading live posts...
          </p>

        ) : (

          uniquePosts.map((post) => (

            <div
              key={post.created_at + post.text}
              className="
              bg-gray-900
              border
              border-gray-700
              rounded-xl
              p-5
              shadow-lg
              hover:border-blue-500
              transition
              "
            >


              {/* POST TEXT */}

              <p
                className="
                text-white
                text-base
                font-semibold
                leading-relaxed
                "
              >
                {post.text}
              </p>



              {/* SENTIMENT BADGE */}

              <div className="mt-3">

                <span
                  className={

                    post.sentiment === "positive"

                    ?

                    `
                    inline-flex
                    items-center
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-bold
                    bg-green-600/20
                    text-green-400
                    border
                    border-green-500
                    `

                    :

                    post.sentiment === "negative"

                    ?

                    `
                    inline-flex
                    items-center
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-bold
                    bg-red-600/20
                    text-red-400
                    border
                    border-red-500
                    `

                    :

                    `
                    inline-flex
                    items-center
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-bold
                    bg-gray-600/20
                    text-gray-300
                    border
                    border-gray-500
                    `
                  }
                >

                  ● {post.sentiment}

                </span>


              </div>




              {/* CONFIDENCE */}

              <p className="
              text-sm
              text-gray-300
              mt-3
              ">

                Confidence:

                <span
                  className="
                  text-blue-400
                  font-bold
                  ml-2
                  "
                >

                  {
  post.confidence_score.toFixed(2)
}%

                </span>


              </p>





              {/* TOPIC */}

              {
                post.topic_name && (

                  <p
                    className="
                    text-sm
                    text-yellow-400
                    mt-3
                    "
                  >

                    Topic:

                    <span className="ml-2 font-semibold">

                      {post.topic_name}

                    </span>


                  </p>

                )
              }







              {/* KEYWORDS */}

              {
                post.keywords &&
                post.keywords.length > 0 && (

                  <div
                    className="
                    flex
                    flex-wrap
                    gap-2
                    mt-3
                    "
                  >

                    {
                      post.keywords.map(
                        (keyword)=>(
                          
                          <span
                            key={keyword}
                            className="
                            bg-blue-600/20
                            text-blue-400
                            border
                            border-blue-500
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            "
                          >

                            #{keyword}

                          </span>

                        )
                      )
                    }


                  </div>


                )
              }





              {/* TIME */}

              <p
                className="
                text-xs
                text-gray-500
                mt-4
                "
              >

                {
                  new Date(
                    post.created_at
                  )
                  .toLocaleString()

                }

              </p>




            </div>


          ))

        )
      }


    </div>

  );

}