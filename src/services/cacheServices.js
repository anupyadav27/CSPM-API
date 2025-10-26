import crypto from "crypto";

const cacheServices = {
    clearAll: (res) => {
        const newETag = crypto.createHash("md5").update(Date.now().toString()).digest("hex");

        res.set({
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
            "Surrogate-Control": "no-store",
            ETag: newETag,
        });
    },
};

export default cacheServices;
