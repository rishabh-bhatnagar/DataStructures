/**
 * A class to represent VanEmdeBoas Tree.
 *
 * @property {number}      u        -  Size of the universe
 * @property {number}      min      -  Minimum element present in the tree.
 * @property {number}      max      -  Maximum element present in the tree.
 * @property {Array}       clusters -  Array of high(sqrt(u)) pointers to
 *                                     VanEmdeBoas(low(sqrt(u))) trees.
 * @property {VanEmdeBoas} summary  -  A pointer summary to a VanEmdeBoas(high(sqrt(u))) tree.
 */
class VanEmdeBoas {
    constructor(u) {
        if (u < 0)
            throw new Error("u should be greater then 0")

        this.min = null;
        this.max = null;
        this.u = 2;

        while (this.u < u) {
            this.u *= this.u;
        }

        if (u > 2) {
            this.summary = null;
            this.clusters = [];
            for (let i = 0; i < this.high(this.u); i++)
                this.clusters.push(null);
        }
    }

    getMin() {
        return this.min;
    }

    getMax() {
        return this.max;
    }

    high(x) {
        return Math.floor(x / Math.sqrt(this.u));
    }

    low(x) {
        return x % Math.ceil(Math.sqrt(this.u));
    }

    index(x, y) {
        return x * Math.floor(Math.sqrt(this.u)) + y
    }

    isMember(x) {
        // base case, where x is the minimum or maximum element
        if (this.min === x || this.max === x)
            return true;

        else if (this.u <= 2)
            return false;

        else {
            let cluster = this.clusters[this.high(x)];
            if (cluster != null)
                return cluster.isMember(this.low(x));
            return false;
        }
    }

    // Function to insert x when vEB tree is empty
    emptyVEBInsert(x) {
        this.min = this.max = x;
    }

    insert(x) {
        if (this.min == null)
            this.emptyVEBInsert(x);
        else {
            // here we get a new minimum element.
            // Since we don't want to lose the original min,
            // however, and so we need to insert it into one of V ’s clusters.
            // Therefore we swap x with min, so that we insert
            // original min into one of the clusters.
            if (x < this.min)
                // swapping x and this.min
                x = x ^ this.min ^ (this.min = x);

            if (this.u > 2){
                let clusterId = this.high(x);
                let highU = this.high(this.u);
                let low = this.low(x);

                // checks whether the cluster that x will go
                // into is empty.
                if (this.clusters[clusterId] == null)
                    this.clusters[clusterId] = new VanEmdeBoas(highU);

                // checking whether the summary is empty
                if (this.summary == null)
                    this.summary = new VanEmdeBoas(highU);

                // inserts x’s cluster number into the summary
                if (this.clusters[clusterId].min == null) {
                    this.summary.insert(clusterId);
                    this.clusters[clusterId].emptyVEBInsert(low);
                }
                else
                    // If x’s cluster is not currently empty, then
                    // inserts x into its cluster
                    this.clusters[clusterId].insert(low);
            }

            // updating max
            if (x > this.max)
                this.max = x;
        }
    }

    delete(x) {
        // base case to check if there is only one
        // element present in the tree.
        if (this.min === this.max)
            this.min = this.max = null;

        else if (this.u === 2) {
            if (x === 0)
                this.min = 1;
            else
                this.min = 0;
            this.max = this.min;
        }
        else {
            let high = this.high(x);
            let low = this.low(x);
            // In this case, we will have to delete an element from a cluster.
            // The element we delete from a cluster might not be x,
            // however, because if x equals min, then once we have
            // deleted x, some other element within one of V ’s clusters
            // becomes the new min, and we have to delete that other element
            // from its cluster.
            if (x === this.min) {
                // sets first-cluster to the number of the cluster
                // that contains the lowest element other than min
                let firstCluster = this.summary.min;
                x = this.index(firstCluster, this.clusters[firstCluster].min);
                this.min = x;
            }

            // we need to delete element x from its cluster,
            // whether x was the value originally passed to delete() or
            // x is the element becoming the new minimum
            this.clusters[this.high(x)].delete(this.low(x));

            if (this.clusters[this.high(x)].min == null) {
                // cluster is empty and now we delete x from its summary.
                this.summary.delete(this.high(x));

                // updating max
                // checking if we are deleting maximum element
                if (x === this.max) {
                    let summaryMax = this.summary.max;

                    // if all clusters are empty, then only minimum value
                    // remain that value is been assigned to max
                    if (summaryMax == null)
                        this.max = this.min;
                    else
                        // sets max to the maximum element in the
                        // highest-numbered cluster
                        this.max = this.index(summaryMax, this.clusters[summaryMax].max);
                }
            }
            else if (x === this.max)
                this.max = this.index(this.high(x), this.clusters[this.high(x)].max);
        }
    }

    // Function to return the next element in tree after x
    successor(x) {
        if (this.u <= 2) {
            // base case, where we are trying to find successor of 0
            // and 1 is present in the vEB tree.
            if (x === 0 && this.max === 1)
                return 1;
            return null;
        }

        // if x is strictly less than min, return the min element
        else if (this.min != null && x < this.min)
            return this.min;

        else {
            let high = this.high(x);
            let low = this.low(x);
            let highCluster = this.clusters[high];
            let maxLow = null;

            // maxLow = maximum element in x's cluster
            if (highCluster != null)
                maxLow = highCluster.max;

            // If x’s cluster contains some element
            // that is greater than x, then we know
            // that x’s successor lies somewhere within x’s cluster
            if (maxLow != null && low < maxLow) {
                let offset = highCluster.successor(low);
                return this.index(high, offset);
            }
            else {
                // if x is greater than or equal to the
                // greatest element in its cluster
                let succCluster = null;
                if (this.summary != null)
                    succCluster = this.summary.successor(high);

                if (succCluster == null)
                    return null;

                else {
                    let offset = this.clusters[succCluster].min;
                    return this.index(succCluster, offset);
                }
            }
        }
    }

    // Function to return the previous element in tree before x
    predecessor(x) {
        if (this.u <= 2) {
            // base case where we are finding predecessor
            // of 1 and 0 is the minimum element
            if (x === 1 && this.min === 0)
                return 0;
            return null;
        }

        // if x is strictly greater than the maximum element
        else if (this.max != null && x > this.max)
            return this.max;

        else {
            let high = this.high(x);
            let low = this.low(x);
            let highCluster = this.clusters[high];
            let minLow = null;

            if (highCluster != null)
                minLow = highCluster.min;

            if (minLow != null && low > minLow) {
                let offset = highCluster.predecessor(low);
                if (offset != null)
                    return this.index(high, offset);
                else
                    return this.index(high, 0);
            }
            else {
                let predCluster = null;
                if (this.summary != null)
                    predCluster = this.summary.predecessor(high);

                // when x’s predecessor, if it exists,
                // does not reside in x’s cluster

                if (predCluster == null) {
                    // x’s predecessor is the minimum value in vEB
                    // tree V , then the successor resides in
                    // no cluster at all.
                    if (this.min != null && x > this.min)
                        return this.min;
                    return null;
                }
                else {
                    let offset = this.clusters[predCluster].max;
                    return this.index(predCluster, offset);
                }
            }
        }
    }
}

const main = function () {
    let veb = new VanEmdeBoas(1000);

    veb.insert(3);
    veb.insert(5);
    veb.insert(10);

    console.log(veb.isMember(3));
    console.log(veb.isMember(4));

    veb.delete(3);

    console.log(veb.isMember(3));

    console.log(veb.successor(5) === 10);
    console.log(veb.predecessor(10) === 5);
};

main();